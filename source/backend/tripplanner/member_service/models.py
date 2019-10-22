from django.db import models
from social_django.models import UserSocialAuth


class Group(models.Model):
    name = models.CharField(max_length=200)
    users = models.ManyToManyField(UserSocialAuth, through='UserToGroup')

    def __str__(self):
        return self.name


class UserToGroup(models.Model):
    user = models.ForeignKey(
        UserSocialAuth, db_column='user_id', on_delete=models.CASCADE)
    group = models.ForeignKey(
        Group, db_column='group_id', on_delete=models.CASCADE)

    class Meta:
        db_table = 'user_group'
