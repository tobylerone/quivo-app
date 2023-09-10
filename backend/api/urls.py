from rest_framework import routers
from .views import FrSentencesViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r"rusentences", FrSentencesViewSet)

urlpatterns = [
    path("", include(router.urls))
]