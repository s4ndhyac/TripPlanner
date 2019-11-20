from .models import Itinerary
from member_service.models import User, Group, UserToGroup
from django.contrib.auth.models import User as Auth_user
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
import json

# Create your tests here.

ITINERARY_CREATE = "http://localhost:8000/itinerary/"
ITINERARY_LIST_BY_GROUP = "http://localhost:8000/itinerary/?group_id="


class ItineraryTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create(first_name="firstname",
                                        last_name="lastname", email="mail@gmail.com", picture="")
        self.group = Group.objects.create(name="Test Group 1")
        django_user = Auth_user.objects.create(username=self.user.email)
        self.token = Token.objects.create(user=django_user)
        UserToGroup.objects.create(user=self.user, group=self.group)

    def test_itinerary_created(self):
        '''Itinerary creation should be successful'''
        itinerary = {
            "name": "Test Itinerary",
            "plan": {},
            "group": self.group.id
        }
        self.client.credentials(
            HTTP_AUTHORIZATION=("Token " + str(self.token)))
        response = self.client.post(
            ITINERARY_CREATE, itinerary, format="json")
        self.assertEqual(201, response.status_code)
        itinerary = Itinerary.objects.get(id=1)
        self.assertEqual(itinerary.name, "Test Itinerary")
        self.assertDictEqual(itinerary.plan, {})
        self.assertEqual(itinerary.group.id, self.group.id)

    def test_itinerary_creation_fail_for_wrong_group(self):
        ''' Itinerary creation should fail for group user is not part of'''
        invalid_group_id = 10
        itinerary = {
            "name": "Test Itinerary",
            "plan": {},
            "group": invalid_group_id
        }
        self.client.credentials(
            HTTP_AUTHORIZATION=("Token " + str(self.token)))
        response = self.client.post(
            ITINERARY_CREATE, itinerary, format="json")
        self.assertEqual(400, response.status_code)

    def test_itinerary_list_for_group(self):
        '''Only those Itineraries belonging to a group should be listed under that group'''
        group1 = self.group
        itinerary1 = Itinerary.objects.create(
            name="Test Itinerary 1", plan={}, group=group1)

        group2 = Group.objects.create(name="Test Group 2")
        itinerary2 = Itinerary.objects.create(
            name="Test Itinerary 2", plan={}, group=group2)

        self.client.credentials(
            HTTP_AUTHORIZATION=("Token " + str(self.token)))
        response1 = self.client.get(ITINERARY_LIST_BY_GROUP+str(group1.id))
        self.assertEqual(200, response1.status_code)

        response1_json = json.loads(response1.content)
        self.assertEqual(len(response1_json), 1)
        self.assertEqual(itinerary1.name, response1_json[0]["name"])
        self.assertDictEqual(itinerary1.plan, itinerary1.plan)
        self.assertEqual(itinerary1.group.id, group1.id)

        self.client.credentials(
            HTTP_AUTHORIZATION=("Token " + str(self.token)))
        response2 = self.client.get(ITINERARY_LIST_BY_GROUP+str(group2.id))
        self.assertEqual(200, response2.status_code)

        response2_json = json.loads(response2.content)
        self.assertEqual(len(response2_json), 1)
        self.assertEqual(itinerary2.name, response2_json[0]["name"])
        self.assertDictEqual(itinerary2.plan, itinerary2.plan)
        self.assertEqual(itinerary2.group.id, group2.id)
