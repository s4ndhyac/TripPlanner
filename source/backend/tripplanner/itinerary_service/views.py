import json
import os
from functools import lru_cache
import pusher
import googlemaps
import requests
from django.core import serializers
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets

from .models import Itinerary
from .serializers import ItinerarySerializer


YELP_API_KEY = os.getenv('YELP_API_KEY', '')
YELP_HEADER = {"Authorization": "Bearer %s" % YELP_API_KEY}

YELP_SEARCH_API = "https://api.yelp.com/v3/businesses/search"
GOOGLE_PLACE_SEARCH_API = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
GOOGLE_PLACE_DETAILS_API = 'https://maps.googleapis.com/maps/api/place/details/json'

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY', '')

LIMIT = 15

client = googlemaps.Client(key=GOOGLE_API_KEY)

pusher_client = pusher.Pusher(
    app_id='908774',
    key='984d71bda00ac34d7d56',
    secret='9d27ac455c2756f3682b',
    cluster='us3',
    ssl=True
)


class ItineraryViewSet(viewsets.ModelViewSet):
    queryset = Itinerary.objects.all()
    serializer_class = ItinerarySerializer
    filterset_fields = ['group_id', 'name', 'id']

    def perform_create(self, serializer):
        serializer.save()
        pusher_client.trigger('private-itinerary-channel',
                              'add-itinerary', serializer.data)

    def perform_update(self, serializer):
        serializer.save()
        pusher_client.trigger('private-itinerary-channel',
                              'update-itinerary', serializer.data)


def search(request):
    try:
        term = request.GET.get('term', '')
        location = request.GET.get('location', '')
        yelp_result = do_yelp_search(
            term, location) if term != '' and location != '' else {'businesses': []}
        gmap_result = do_google_maps_search(term + ', ' + location)
        return JsonResponse(concatenate_results(yelp_result, gmap_result))
    except Exception as e:
        return JsonResponse({"error": str(e)})


def concatenate_results(yelp_result, gmap_result):
    yelp_items = yelp_result['businesses']
    gmap_items = gmap_result['details']
    return {'items': yelp_items + gmap_items}


def do_google_maps_search(search_input):
    params = {
        'input': search_input,
        'key': GOOGLE_API_KEY,
        'inputtype': 'textquery'
    }
    req = requests.get(GOOGLE_PLACE_SEARCH_API, params=params)
    if req.status_code != 200:
        raise Exception('Error happened during google map search')
    details = [get_details(place['place_id'])
               for place in req.json()['candidates']]
    return {'details': details}


def get_details(place_id):
    req = requests.get(GOOGLE_PLACE_DETAILS_API, params={
        'key': GOOGLE_API_KEY,
        'place_id': place_id
    })
    return req.json()


def do_yelp_search(term, location):
    params = {
        "term": term,
        "location": location,
        "limit": LIMIT
    }
    req = requests.get(YELP_SEARCH_API, params=params, headers=YELP_HEADER)
    if req.status_code != 200:
        raise Exception(
            "Yelp search status code is {}, not 200".format(req.status_code))
    return json.loads(req.text)


def generate_plan(request):
    plan = json.loads(request.body.decode('utf-8'))
    return JsonResponse(Itinerary.optimize(plan))


def get_geocode(request):
    addresses = request.GET.get('addresses', [])
    addresses = json.loads(addresses) if len(addresses) > 0 else []
    geocodes = [fetch_geocode(address) for address in addresses]
    print(fetch_geocode.cache_info())
    return JsonResponse({'geocodes': geocodes})


@lru_cache(maxsize=128)
def fetch_geocode(address):
    attempts, exception = 0, None
    while attempts < 3:
        try:
            return client.geocode(address)[0]['geometry']['location']
        except Exception as e:
            exception = e
            attempts += 1
    raise e
