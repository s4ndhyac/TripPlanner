import os

from django.contrib.postgres.fields import JSONField
from django.db import models

from .optimizer import sort_sequence


class Itinerary(models.Model):
    name = models.CharField(max_length=200)
    plan = JSONField()
    group = models.ForeignKey(
        'member_service.Group', db_column='group_id', on_delete=models.CASCADE)

    @staticmethod
    def optimize(plan):
        if 'list' not in plan['plan']:
            return {'plan': {'list': []}}
        for plan_of_day in plan['plan']['list']:
            plan_of_day['sequence'] = sort_sequence(plan_of_day['sequence'])
        return plan
