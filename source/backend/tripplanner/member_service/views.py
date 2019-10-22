from django.shortcuts import render, redirect
from django.contrib.auth import logout as auth_logout


def logout(request):
    auth_logout(request)
    return redirect('/members')


def index(request):
    if request.user.is_authenticated:
        context = {'logged_in': request.user.is_authenticated}
        return render(request, 'members/dashboard.html', context)
    else:
        return render(request, 'members/index.html')
