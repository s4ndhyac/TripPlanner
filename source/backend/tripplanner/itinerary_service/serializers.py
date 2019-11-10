from rest_framework import serializers
from .models import Itinerary
from member_service.serializers import GroupSerializer


class ItinerarySerializer(serializers.ModelSerializer):
    group = GroupSerializer()

    class Meta:
        model = Itinerary
        fields = '__all__'
