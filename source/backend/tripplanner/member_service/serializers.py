from rest_framework import serializers
from .models import User, Group, UserToGroup


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'


class UserToGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserToGroup
        fields = '__all__'
