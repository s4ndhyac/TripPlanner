import json
import logging

import requests
from django.contrib.auth import logout as auth_logout
from django.core import serializers
from django.forms.models import model_to_dict
from django.http import HttpResponse, HttpResponseForbidden, JsonResponse
from django.shortcuts import redirect, render
from rest_framework import viewsets
from social_django.models import UserSocialAuth

from .models import Group, User, UserToGroup
from .serializers import GroupSerializer, UserSerializer, UserToGroupSerializer

logger = logging.getLogger(__name__)

GOOGLE_OAUTH_API = "https://oauth2.googleapis.com/tokeninfo?id_token={}"


# CRUD and filtering
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filterset_fields = ['email', 'id']


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    filterset_fields = ['name', 'id']


class UserToGroupViewSet(viewsets.ModelViewSet):
    queryset = UserToGroup.objects.all()
    serializer_class = UserToGroupSerializer
    filterset_fields = ['user_id', 'group_id']


def logout(request):
    auth_logout(request)
    return redirect('/members')


def authenticate(request):
    bearer_token = request.headers.get('Authorization')
    try:
        user = find_user_by_token(bearer_token)
        return JsonResponse(model_to_dict(user))
    except Exception as e:
        logger.error(e)
        return HttpResponseForbidden()


def addGroup(request):
    try:
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        group = Group(name=body['name'])
        group.save()
        # need to consider if there are many users using the same email
        user = User.objects.get(email=body['email'])
        print(user.id)
        group.users.add(user.id)
        group.save()
        return HttpResponse(group)
    except Exception as e:
        logger.error(e)
        return HttpResponseForbidden()


def get_user_from_google(token):
    return requests.get(GOOGLE_OAUTH_API.format(token)).json()


def find_user_by_token(token):
    data = get_user_from_google(token)
    if 'error' in data:
        raise Exception(data['error'])
    user, _ = User.objects.get_or_create(
        email=data['email'], first_name=data['given_name'],
        last_name=data['family_name'], picture=data['picture']
    )
    return user


def index(request):
    return render(request, 'members/dashboard.html' if request.user.is_authenticated else 'members/index.html')
