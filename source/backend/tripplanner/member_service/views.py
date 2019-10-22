from django.shortcuts import render, redirect
from django.contrib.auth import logout as auth_logout


def logout(request):
    auth_logout(request)
    return redirect('/members')


def index(request):
    return render(request, 'members/dashboard.html' if request.user.is_authenticated else 'members/index.html')
