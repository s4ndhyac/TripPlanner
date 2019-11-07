from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('logout/', views.logout, name='logout'),
    path('auth-user/', views.authenticate, name='authenticate'),
    path('user-group/', views.user_group, name='user_group')
]
