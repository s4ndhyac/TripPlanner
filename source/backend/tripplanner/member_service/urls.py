from django.urls import path
from django.conf.urls import url, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'', views.GroupViewSet)

urlpatterns = [
    path('', views.index, name='index'),
    path('logout/', views.logout, name='logout'),
    path('auth-user/', views.authenticate, name='authenticate'),
    path('addGroup/', views.addGroup, name='addGroup'),
    url(r'^group/', include(router.urls))
]
