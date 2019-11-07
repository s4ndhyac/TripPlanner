from django.db import models
from django.contrib.postgres.fields import JSONField

# Create your models here.


class Itinerary(models.Model):
    name = models.CharField(max_length=200)
    plan = JSONField()
    group = models.ForeignKey(
        'member_service.Group', db_column='group_id', on_delete=models.CASCADE)
