import logging
from unittest import mock

from django.test import RequestFactory, TestCase

from .models import User
from .views import authenticate

logging.disable(logging.CRITICAL)

VALID_TOKEN = 'VALID'


USER_DATA = {
    'email': 'test@gmail.com',
    'given_name': 'test_first_name',
    'family_name': 'test_family_name',
    'picture': 'picture_url'
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
        response = authenticate(request)
        self.assertEqual(response.status_code, 200)

    @mock.patch('member_service.views.get_user_from_google', mock_oauth_call)
    def test_user_cannot_login_with_invalid_token(self):
        request = self.__mock_request('INVALID_TOKEN')
        response = authenticate(request)
        self.assertEqual(response.status_code, 403)

    @mock.patch('member_service.views.get_user_from_google', mock_oauth_call)
    def test_should_create_new_entry_if_user_does_not_exist(self):
        previous_count = User.objects.all().count()
        request = self.__mock_request(VALID_TOKEN)
        authenticate(request)
        new_count = User.objects.all().count()
        self.assertEqual(new_count, previous_count + 1)

    @mock.patch('member_service.views.get_user_from_google', mock_oauth_call)
    def test_should_not_create_new_entry_if_user_exists(self):
        User.objects.create(email=USER_DATA['email'], first_name=USER_DATA['given_name'],
                            last_name=USER_DATA['family_name'], picture=USER_DATA['picture'])
        previous_count = User.objects.all().count()
        request = self.__mock_request(VALID_TOKEN)
        authenticate(request)
        new_count = User.objects.all().count()
        self.assertEqual(new_count, previous_count)
