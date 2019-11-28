from django.conf.urls import include, url
from django.urls import path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'', views.ItineraryViewSet)

urlpatterns = [
    path('search/', views.search, name='search'),
    path('generate/', views.generate_plan, name='generate'),
    path('geocode/', views.get_geocode, name='get_geocode'),
    url(r'^', include(router.urls))
]
