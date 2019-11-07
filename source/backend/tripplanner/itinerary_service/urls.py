from django.urls import path
from django.conf.urls import url, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'', views.ItineraryViewSet)

urlpatterns = [
    path('search/', views.search, name='search'),
    url(r'^', include(router.urls))

]
