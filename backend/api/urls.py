from rest_framework import routers
from .views import FrSentencesViewSet
from django.urls import path, include
from . import views

router = routers.DefaultRouter()
router.register(r"frsentences", FrSentencesViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path('register', views.UserRegisterView.as_view(), name='register'),
	path('login', views.UserLoginView.as_view(), name='login'),
	path('logout', views.UserLogoutView.as_view(), name='logout'),
    path('users', views.UserViewSet.as_view(), name='user-list'),
	path('users/me', views.CurrentUserView.as_view(), name='current-user'), # Il y aura un changement de nom
	path('users/<int:user_id>/following/', views.UserFollowingView.as_view(), name='user-following'),
	path('users/<int:user_id>/followers/', views.UserFollowersView.as_view(), name='user-followers'),
	path('follow', views.UserFollowView.as_view(), name='follow-user'),
    path('unfollow', views.UserUnfollowView.as_view(), name='unfollow-user'),
	path('csrf', views.csrf, name='csrf')
	]