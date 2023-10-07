from rest_framework import viewsets
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from language_app.models import FrSentence
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer, FrSentenceModelSerializer
from .validations import custom_validation, validate_username, validate_password

class UserRegister(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		clean_data = custom_validation(request.data)
		serializer = UserRegisterSerializer(data=clean_data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.create(clean_data)
			if user:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)
	##
	def post(self, request):

		data = request.data
		assert validate_username(data)
		assert validate_password(data)

		serializer = UserLoginSerializer(data=data)

		if serializer.is_valid(raise_exception=True):

			user = serializer.check_user(data)
			login(request, user)
			return Response(serializer.data, status=status.HTTP_200_OK)


class UserLogout(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		logout(request)
		return Response(status=status.HTTP_200_OK)


class UserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	##
	def get(self, request):
		serializer = UserSerializer(request.user)
		return Response({'user': serializer.data}, status=status.HTTP_200_OK)


class FrSentencesViewSet(viewsets.ModelViewSet):
	queryset = FrSentence.objects.all()
	serializer_class = FrSentenceModelSerializer


def csrf(request):
	# CSRF sert a proteger contre des attaques dans un navigateur. Or,
	# cette api ne sera utilise que pour cette application mobile, mais
	# je le garderai quand-meme au cas ou je veux reutiliser l'api pour
	# un site web
	return JsonResponse({'csrfToken': get_token(request)})