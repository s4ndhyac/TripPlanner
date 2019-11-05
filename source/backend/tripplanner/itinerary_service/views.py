import json
import requests
from django.shortcuts import render
from django.core import serializers
from django.http import JsonResponse


YELP_API_KEY = "MB_TUAI96_WP-B2XJl6S06raCPLAKzrJdJXd1kXgngCQMEJrjy-ubXDALP7Xd1yaQv0ArIjgna1zah1R2iXEHqFHC_yVjFlDwKpbc5v5EDWl3nbZGU0E3_tNtC-_XXYx"
YELP_HEADER = {"Authorization": "Bearer %s" % YELP_API_KEY}

YELP_SEARCH_API = "https://api.yelp.com/v3/businesses/search"

LIMIT = 10


def search(request):
    api = request.GET.get('api', None)
    try:
        if api == "yelp":
            return JsonResponse(do_yelp_search(request.GET.get('term', None), request.GET.get('location', None)))
        elif api == "google-maps":
            return JsonResponse(do_google_maps_search())
        else:
            raise Exception("Search mode {} not recognized".format(api))
    except Exception as e:
        return JsonResponse({"error": str(e)})


def do_google_maps_search():
    pass


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
