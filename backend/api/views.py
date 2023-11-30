from rest_framework import viewsets, generics
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import AppUser, UserFollow
from language_app.models import FrSentence, FrWordFrequency
from .serializers import (
    UserRegisterSerializer,
    UserLoginSerializer,
    UserFollowSerializer,
	UserToggleKnownWordSerializer,
    UserSerializer,
    FrSentenceModelSerializer,
    FrWordFrequencyModelSerializer
	)
from .validations import custom_validation, validate_username, validate_password

class UserRegisterView(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		clean_data = custom_validation(request.data)
		serializer = UserRegisterSerializer(data=clean_data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.create(clean_data)
			if user:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)

	def post(self, request):

		data = request.data
		assert validate_username(data)
		assert validate_password(data)

		serializer = UserLoginSerializer(data=data)

		if serializer.is_valid(raise_exception=True):

			user = serializer.check_user(data)
			login(request, user)
			#return Response(serializer.data, status=status.HTTP_200_OK)
			# User is logged in, but don't need to return any user data
			return Response(status=status.HTTP_200_OK)


class UserLogoutView(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		logout(request)
		return Response(status=status.HTTP_200_OK)


class UserFollowingView(generics.ListAPIView):
	# Cette ligne ne marchera pas. Je vais devoir creer un nouveau serializer
	# pareil pour UserFollowerView
    serializer_class = UserSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = AppUser.objects.get(user_id=user_id)
        return user.following.all()
	
class UserFollowersView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = AppUser.objects.get(user_id=user_id)
        return user.followed_by.all()

class UserFollowView(APIView):
	def post(self, request):
		serializer = UserFollowSerializer(data=request.data)

		if serializer.is_valid():

			# TODO: Ensure user can't follow themselves

			follower = serializer.validated_data.get('follower')
			followee = serializer.validated_data.get('followee')

			# Get the follow record
			follow_record = UserFollow.objects.filter(follower=follower, followee=followee)

            # If the follow record already exists, don't replicate it
			if follow_record.exists():
				return Response({"message": "User already being followed by this account"}, status=status.HTTP_409_CONFLICT)
			
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserUnfollowView(APIView):
    def delete(self, request):
        serializer = UserFollowSerializer(data=request.data)
        if serializer.is_valid():

            follower = serializer.validated_data.get('follower')
            followee = serializer.validated_data.get('followee')

            # Get the follow record
            follow_record = UserFollow.objects.filter(follower=follower, followee=followee)

            # If the follow record exists, delete it
            if follow_record.exists():
                follow_record.delete()
                return Response({"message": "Successfully unfollowed"}, status=status.HTTP_200_OK)
            
            return Response({"message": "Follow record not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserToggleKnownWordView(APIView):

	def post(self, request, *args, **kwargs):

		user_id = self.kwargs.get('user_id')
		word = self.kwargs.get('word')

		#serializer = UserToggleKnownWordSerializer(data=request.data)
		serializer = UserToggleKnownWordSerializer(data={'user_id': user_id, 'word': word})
		
		if serializer.is_valid():

			user_id = serializer.validated_data['user_id']
			word = serializer.validated_data['word']

			user = AppUser.objects.get(user_id=user_id)
			word_obj = FrWordFrequency.objects.get(word=word)
		
			# Check if a user knows a word
			if word_obj in user.known_words.all():

				user.known_words.remove(word_obj)
			else:

				user.known_words.add(word_obj)

			return Response({"status": "success"})
		else:

			return Response(serializer.errors, status=400)

class CurrentUserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	##

	def get(self, request):
		serializer = UserSerializer(request.user)
		return Response({'user': serializer.data}, status=status.HTTP_200_OK)

class UserViewSet(generics.ListAPIView):
    queryset = AppUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)


class FrSentencesViewSet(viewsets.ModelViewSet):
	queryset = FrSentence.objects.all()
	serializer_class = FrSentenceModelSerializer


class FrWordFrequencyView(generics.RetrieveAPIView):
    
	serializer_class = FrWordFrequencyModelSerializer

	def get_object(self):
		word = self.kwargs['word']
        
		# Qu'est-ce qui se passe s'il y a plusieurs mots avec
		# la meme orthographe ? Cela n'arrivera pas pour
		# l'instant mais ca pourrait changer a l'avenir
		word_data = FrWordFrequency.objects.get(word=word)
		
		return word_data#.first()
	
	def get_serializer_context(self):

		return {'request': self.request}


def csrf(request):
	# CSRF sert a proteger contre des attaques dans un navigateur. Or,
	# cette api ne sera utilise que pour cette application mobile, mais
	# je le garderai quand-meme au cas ou je veux reutiliser l'api pour
	# un site web
	return JsonResponse({'csrfToken': get_token(request)})