import logging
from unittest import mock
from .models import User, Group, UserToGroup
from django.contrib.auth.models import User as Auth_user
from rest_framework.authtoken.models import Token
import json

from django.test import RequestFactory, TestCase
from .views import login

logging.disable(logging.CRITICAL)

VALID_TOKEN = 'VALID'

GROUP_CREATE = "http://localhost:8000/members/addGroup/"

USER_DATA = {
    'email': 'test@gmail.com',
    'given_name': 'test_first_name',
    'family_name': 'test_family_name',
    'picture': 'picture_url'
}

USER_DATA_2 = {
    'email': 'test2@gmail.com',
    'given_name': 'test2_first_name',
    'family_name': 'test2_family_name',
    'picture': 'picture_url'
}

groupCreate = {
            'name': 'groupTest',
            'email': USER_DATA['email']
}

def mock_oauth_call(token):
    return USER_DATA if token == VALID_TOKEN else {'error': 'Invalid token'}


class UserTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def __mock_request(self, token):
        request = self.factory.get('/member-service/auth-user/')
        request.META['HTTP_Authorization'] = token
        return request

    @mock.patch('member_service.views.get_user_from_google', mock_oauth_call)
    def test_user_can_login_with_valid_token(self):
        request = self.__mock_request(VALID_TOKEN)
        response = login(request)
        self.assertEqual(response.status_code, 200)

    @mock.patch('member_service.views.get_user_from_google', mock_oauth_call)
    def test_user_cannot_login_with_invalid_token(self):
        request = self.__mock_request('INVALID_TOKEN')
        response = login(request)
        self.assertEqual(response.status_code, 403)

    @mock.patch('member_service.views.get_user_from_google', mock_oauth_call)
    def test_should_create_new_entry_if_user_does_not_exist(self):
        previous_count = User.objects.all().count()
        request = self.__mock_request(VALID_TOKEN)
        login(request)
        new_count = User.objects.all().count()
        self.assertEqual(new_count, previous_count + 1)

    @mock.patch('member_service.views.get_user_from_google', mock_oauth_call)
    def test_should_not_create_new_entry_if_user_exists(self):
        User.objects.create(email=USER_DATA['email'], first_name=USER_DATA['given_name'],
                            last_name=USER_DATA['family_name'], picture=USER_DATA['picture'])
        previous_count = User.objects.all().count()
        request = self.__mock_request(VALID_TOKEN)
        login(request)
        new_count = User.objects.all().count()
        self.assertEqual(new_count, previous_count)

    def test_group_created(self):
        ''' group creation should be successful'''
        User.objects.create(email=USER_DATA['email'], first_name=USER_DATA['given_name'],
                            last_name=USER_DATA['family_name'], picture=USER_DATA['picture'])
        
        header = {'HTTP_X_HTTP_METHOD_OVERRIDE': 'PUT'}
        response = self.client.post(GROUP_CREATE, content_type='application/json', data=groupCreate, **header)
        group = Group.objects.all()
        self.assertEqual(group[0].name, groupCreate['name'])

    def test_group_should_be_created_in_two_tables(self):
        ''' group creation should be created in two tables'''
        previous_group_count = Group.objects.all().count()
        previous_usergroup_count = UserToGroup.objects.all().count()
        User.objects.create(email=USER_DATA['email'], first_name=USER_DATA['given_name'],
                            last_name=USER_DATA['family_name'], picture=USER_DATA['picture'])
        header = {'HTTP_X_HTTP_METHOD_OVERRIDE': 'PUT'}
        response = self.client.post(GROUP_CREATE, content_type='application/json', data=groupCreate, **header)
        new_group_count = Group.objects.all().count()
        new_usergroup_count = UserToGroup.objects.all().count()
        self.assertEqual(new_group_count, previous_group_count + 1)
        self.assertEqual(new_usergroup_count, previous_usergroup_count + 1)

    def test_users_cannot_see_other_users_groups(self):
        ''' 2nd user shouldn't see groups belong to 1st user'''
        User.objects.create(email=USER_DATA['email'], first_name=USER_DATA['given_name'],
                            last_name=USER_DATA['family_name'], picture=USER_DATA['picture'])
        User.objects.create(email=USER_DATA_2['email'], first_name=USER_DATA_2['given_name'],
                            last_name=USER_DATA_2['family_name'], picture=USER_DATA_2['picture'])
        
        user = User.objects.filter(email=USER_DATA['email'], first_name=USER_DATA['given_name'],
                            last_name=USER_DATA['family_name'], picture=USER_DATA['picture'])
        user2 = User.objects.filter(email=USER_DATA_2['email'], first_name=USER_DATA_2['given_name'],
                            last_name=USER_DATA_2['family_name'], picture=USER_DATA_2['picture'])
        
        # create a group which belongs to user1
        header = {'HTTP_X_HTTP_METHOD_OVERRIDE': 'PUT'}
        response = self.client.post(GROUP_CREATE, content_type='application/json', data=groupCreate, **header)
        new_usergroup_count = UserToGroup.objects.all()
        new_usergroup_count_total = UserToGroup.objects.all().count()

        self.assertEqual(new_usergroup_count[0].user_id, user[0].id)
        self.assertEqual(new_usergroup_count_total, 1)
        