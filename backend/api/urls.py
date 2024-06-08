from rest_framework import routers
from django.urls import path, include
from . import views

router = routers.DefaultRouter()
#router.register(r"sentences/<int:perc_comprehension>", views.SentencesViewSet, basename="sentences")
router.register(r"languages", views.LanguagesViewSet, basename="languages")

urlpatterns = [
    # General
    path("", include(router.urls)),
    path('register', views.UserRegisterView.as_view(), name='register'),
	path('login', views.UserLoginView.as_view(), name='login'),
	path('logout', views.UserLogoutView.as_view(), name='logout'),
    path('users', views.UserViewSet.as_view(), name='user-list'),
	path('users/me', views.CurrentUserView.as_view(), name='current-user'), # Il y aura un changement de nom
    path('users/changecurrentlanguage', views.UserChangeCurrentLanguageView.as_view(), name='change-language'),
    path('users/currentlanguage', views.UserGetCurrentLanguageView.as_view(), name='get-language'),
    path('users/addlanguage/', views.UserAddLanguageView.as_view(), name='user-add-language'),
    path('users/changeavatar/', views.UserChangeAvatarView.as_view(), name='user-change-avatar'),
    path('users/incrementstreak', views.UserIncrementStreakView.as_view(), name='user-increment-streak'),
    path('users/<int:user_id>/knownlanguages', views.UserKnownLanguagesView.as_view(), name='user-languages'),
    path('users/<int:user_id>/monthlywordcounts/<str:language_code>', views.UserMonthlyKnownWordsView.as_view(), name='user-monthly-words'),
	path('users/<int:user_id>/following/', views.UserFollowingView.as_view(), name='user-following'),
	path('users/<int:user_id>/followers/', views.UserFollowersView.as_view(), name='user-followers'),
	path('users/<int:user_id>/wordcounts/', views.UserWordCountsView.as_view(), name='user-word-counts'),
    path('users/<int:user_id>/toggleknownword/<str:word>', views.UserToggleKnownWordView.as_view(), name='user-toggle-word'),
    path('sentences/<int:perc_known_words>', views.SentencesViewSet.as_view({'get': 'list'}), name='sentences'),
	path('follow/<int:follower_id>/<int:followee_id>', views.UserFollowView.as_view(), name='follow-user'),
    path('unfollow/<int:follower_id>/<int:followee_id>', views.UserUnfollowView.as_view(), name='unfollow-user'),
	path('suggestion', views.SuggestionView.as_view(), name='suggestion'),
    path('csrf', views.csrf, name='csrf'),
    
	# Phrases

	# les characteres speciales dans 'word' seront encode et decode automatiquement par django,
	# mais ce serait bien de trouver une meilleure approche ici
	path('words', views.WordDataView.as_view(), name='words-data'),
]