import json
import logging
import os

import requests
from django.contrib.auth import logout as auth_logout
from django.core import serializers
from django.forms.models import model_to_dict
from django.http import HttpResponse, HttpResponseForbidden, JsonResponse
from django.shortcuts import redirect, render
from rest_framework import viewsets
from social_django.models import UserSocialAuth
from django.core.mail import EmailMessage
from django.conf import settings
from .models import Group, User, UserToGroup
from .serializers import GroupSerializer, UserSerializer, UserToGroupSerializer

from django.contrib.auth.models import User as Auth_user
from rest_framework.authtoken.models import Token

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


def login(request):
    bearer_token = request.headers.get('Authorization')
    try:
        user = find_user_by_token(bearer_token)
        django_user, _ = Auth_user.objects.get_or_create(username=user.email)
        token, _ = Token.objects.get_or_create(user=django_user)
        resp = model_to_dict(user)
        resp['tokenId'] = token.key
        return JsonResponse(resp)
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
        group.users.add(user.id)
        group.save()
        return HttpResponse(group)
    except Exception as e:
        logger.error(e)
        return HttpResponseForbidden()


def deleteMember(request):
    try:
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        # check how many members left in the target group
        groupusers = body['group']['users']
        
        usergroupId = body['id']
        targetUserGroup = UserToGroup.objects.get(id=usergroupId)
        targetUserGroup.delete()

        if len(groupusers) == 1:
            groupId = body['group']['id']
            targetGroup = Group.objects.get(id=groupId)
            targetGroup.delete()
        
        return HttpResponse("Delete the member successfully.")
    except Exception as e:
        logger.error(e)
        return HttpResponseForbidden()


def inviteMember(request):
    try:
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        email_from = settings.EMAIL_HOST_USER
        recipient_list = [body['email']]
        
        # chekc if the email were registered or not
        user = User.objects.filter(email=body['email'])
        
        if not user:
            subject = 'TripPlanner Invitation!!!'
            message = 'Hi, <p>Here is an invitation from your friend , to \
                      join the TripPlanner.<p> <p><a href="http://localhost:3000/">Click</a> to join TripPlanner.<p>'
            email = EmailMessage(subject, message, email_from, recipient_list)
            email.content_subtype = "html"
            email.send()
            return HttpResponse("This email address hasn't been registered yet. An register invitation has been sent.")
        else:
            groupName = body['groupName']
            group = Group.objects.filter(name=groupName)
            memberInGroup = UserToGroup.objects.filter(group_id=group[0].id, user_id=user[0].id)
            if not memberInGroup:
                invitetogroup = UserToGroup(group_id=group[0].id, user_id=user[0].id)
                invitetogroup.save()

                subject = 'TripPlanner Invitation!!!'
                message = 'Hi, <p>You have been invited into a new Group!<p> \
                           <p><a href="http://localhost:3000/">login</a> to check it out.<p>'
                email = EmailMessage(subject, message, email_from, recipient_list)
                email.content_subtype = "html"
                email.send()    
                return HttpResponse("Invite existed user successfully.")
            else:
                return HttpResponse("The member has already been in the group.")

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
