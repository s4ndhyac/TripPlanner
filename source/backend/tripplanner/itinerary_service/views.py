import os
import json
import requests
from django.shortcuts import render
from django.core import serializers
from django.http import JsonResponse

YELP_API_KEY = os.getenv('YELP_API_KEY', '')
YELP_HEADER = {"Authorization": "Bearer %s" % YELP_API_KEY}

YELP_SEARCH_API = "https://api.yelp.com/v3/businesses/search"
GOOGLE_PLACE_SEARCH_API = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
GOOGLE_PLACE_DETAILS_API = 'https://maps.googleapis.com/maps/api/place/details/json'

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY', '')

LIMIT = 15


def search(request):
    try:
        api = request.GET.get('api', None)
        if api == "yelp":
            return JsonResponse(do_yelp_search(request.GET.get('term', ''), request.GET.get('location', '')))
        elif api == "google-maps":
            return JsonResponse(do_google_maps_search(request.GET.get('input', '')))
        else:
            raise Exception("Search mode {} not recognized".format(api))
    except Exception as e:
        return JsonResponse({"error": str(e)})


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
