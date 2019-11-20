import os

import googlemaps
from django.contrib.postgres.fields import JSONField
from django.db import models

from .optimizer import solve_tsp

client = googlemaps.Client(key=os.getenv('GOOGLE_API_KEY', ''))


class Itinerary(models.Model):
    name = models.CharField(max_length=200)
    plan = JSONField()
    group = models.ForeignKey(
        'member_service.Group', db_column='group_id', on_delete=models.CASCADE)

    @staticmethod
    def optimize(plan):
        def sort(sequence):
            places = [item['address'] for item in sequence]
            json_matrix = client.distance_matrix(places, places, mode='driving')
            route = solve_tsp(json_matrix)
            optimized_sequence = [sequence[i] for i in route]
            return optimized_sequence

        if 'list' not in plan['plan']:
            return {'plan': {'list': []}}
        for plan_of_day in plan['plan']['list']:
            plan_of_day['sequence'] = sort(plan_of_day['sequence'])
        return plan
