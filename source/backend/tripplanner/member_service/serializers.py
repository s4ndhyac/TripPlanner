from rest_framework import serializers
from .models import Group, UserToGroup


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'


class UserToGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserToGroup
        fields = '__all__'
