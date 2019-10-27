import requests
from django.contrib.auth import logout as auth_logout
from django.core import serializers
from django.http import HttpResponse, HttpResponseForbidden
from django.shortcuts import redirect, render

from .models import User

GOOGLE_OAUTH_API = "https://oauth2.googleapis.com/tokeninfo?id_token={}"


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
