from django.urls import path
from django.conf.urls import url, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'group', views.GroupViewSet, 'group')
router.register(r'user', views.UserViewSet, 'user')
router.register(r'usergroup', views.UserToGroupViewSet, 'usergroup')

urlpatterns = [
    path('', views.index, name='index'),
    path('logout/', views.logout, name='logout'),
    path('auth-user/', views.authenticate, name='authenticate'),
    path('addGroup/', views.addGroup, name='addGroup'),
    path('deleteMember/', views.deleteMember, name='deleteMember'),
    path('inviteMember/', views.inviteMember, name='inviteMember'),
    url(r'^v1/', include(router.urls))
]
