import requests
import json
from django.contrib.auth import logout as auth_logout
from django.core import serializers
from django.http import HttpResponse, HttpResponseForbidden
from django.shortcuts import redirect, render

from social_django.models import UserSocialAuth

from .models import User, Group
from rest_framework import viewsets
from .serializers import GroupSerializer, UserSerializer

GOOGLE_OAUTH_API = "https://oauth2.googleapis.com/tokeninfo?id_token={}"


# CRUD and filtering on User to list Users
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filterset_fields = ['email']


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    filterset_fields = ['name']


def logout(request):
    auth_logout(request)
    return redirect('/members')


def authenticate(request):
    bearer_token = request.headers.get('Authorization')
    try:
        user = find_user_by_token(bearer_token)
        return HttpResponse(serializers.serialize('json', user))
    except Exception as e:
        print(e)
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
        print(e)
        return HttpResponseForbidden()


def find_user_by_token(token):
    data = requests.get(GOOGLE_OAUTH_API.format(token)).json()
    if 'error' in data:
        raise Exception(data['error'])
    query_result = User.objects.filter(email=data['email'])
    if query_result.count() == 0:
        user = User(email=data['email'], first_name=data['given_name'],
                    last_name=data['family_name'], picture=data['picture'])
        user.save()
        return user
    return query_result


def index(request):
    return render(request, 'members/dashboard.html' if request.user.is_authenticated else 'members/index.html')
