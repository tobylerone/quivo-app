from rest_framework import routers
from .views import RuSentencesViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r"rusentences", RuSentencesViewSet)

urlpatterns = [
    path("", include(router.urls))
]