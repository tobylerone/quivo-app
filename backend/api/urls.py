from rest_framework import routers
from .views import FrSentencesViewSet
from django.urls import path, include
from . import views

router = routers.DefaultRouter()
router.register(r"frsentences", FrSentencesViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path('register', views.UserRegister.as_view(), name='register'),
	path('login', views.UserLogin.as_view(), name='login'),
	path('logout', views.UserLogout.as_view(), name='logout'),
	path('user', views.UserView.as_view(), name='user'),
    path('csrf', views.csrf, name='csrf')
]