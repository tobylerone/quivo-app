from rest_framework import viewsets, generics
from django.db.models import Exists, OuterRef
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.contrib.auth import login, logout
from django.core import serializers
from django.utils import timezone
import datetime
import random
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.db.models import Q
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import AppUser, UserWord

from language_app.models import Language, ThSentence, ThWordData
from .serializers import (
    UserRegisterSerializer,
    UserLoginSerializer,
	UserToggleKnownWordSerializer,
	UserChangeAvatarSerializer,
	UserWordCountsSerializer,
	UserMonthlyKnownWordsSerializer,
    UserSerializer,
	LanguageModelSerializer,
	ThSentenceModelSerializer,
	ThWordDataModelSerializer,
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

		if serializer.is_valid(raise_exception=False):

			user = serializer.check_user(data)
			login(request, user)

			# Set current language in session data
			profile = AppUser.objects.get(username=user.username)
			request.session['current_language_code'] = profile.last_current_language

			#return Response(serializer.data, status=status.HTTP_200_OK)
			# User is logged in, but don't need to return any user data
			return Response(status=status.HTTP_200_OK)
		
		print(serializer.errors)

		return Response(status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		current_language_code = request.session.get('current_language_code')

		# Save the current language from the session data for next login
		if request.user.is_authenticated:
			profile = AppUser.objects.get(user=request.user)
			profile.last_current_language = current_language_code
			profile.save()

		logout(request)
		return Response(status=status.HTTP_200_OK)
	

class UserChangeCurrentLanguageView(APIView):
	def post(self, request, *args, **kwargs):

		try:
			language_code = request.data.get('language_code')

			# TODO: Remove hard coding
			if language_code in ['th']:

				request.session['current_language_code'] = language_code
				return Response(status=status.HTTP_200_OK)
		except Exception as e:
			print(e)


class UserGetCurrentLanguageView(APIView):
	def get(self, request):
		return Response(request.session['current_language_code'], status=200)


class UserChangeAvatarView(APIView):
	def post(self, request, *args, **kwargs):
		user_id = request.data.get('user_id')

		try:
			# TODO: Extend this to other views
			user = AppUser.objects.get(user_id=user_id)
		except AppUser.DoesNotExist:
			return Response({"error": "User not found"}, status=404)

		serializer = UserChangeAvatarSerializer(user, data=request.data, partial=True)

		if serializer.is_valid():
			#serializer.update(instance=user, validated_data=serializer.validated_data)
			serializer.save()
			return Response({"status": "success"})
		else:
			print(serializer.errors)
			return Response(serializer.errors, status=400)


class UserMonthlyKnownWordsView(generics.ListAPIView):
	
	serializer_class = UserMonthlyKnownWordsSerializer

	def get_queryset(self):
		user_id = self.kwargs['user_id']
		language_code = self.kwargs['language_code']

		# Get the current date
		now = timezone.now().date()

		days = 30

		# Calculate the date 30 days ago
		thirty_days_ago = now - datetime.timedelta(days=days)

		# Create a range of dates for the last 30 days
		date_range = [now - datetime.timedelta(days=x) for x in range(0, days)]

		# TODO: provide option to get known words across all languages
		queryset = UserWord.objects.filter(
    		user_id=user_id,
    		#**{f'word_{language_code}': user_id}, #OuterRef('pk')},
			known_date__gte=thirty_days_ago
			).annotate(day=TruncDate('known_date')
			).values('day'
			).annotate(word_count=Count('id')
			)#.order_by('day')
		
		# Convert queryset to a list of dictionaries
		queryset_list = list(queryset)

		# Merge date_range with queryset_list
		for date in date_range:
			if not any(d['day'] == date for d in queryset_list):
				queryset_list.append({'day': date, 'word_count': 0})

		# Sort the list by day
		queryset_list.sort(key=lambda x: x['day'])

		#return queryset
		return queryset_list


class UserToggleKnownWordView(APIView):

	def post(self, request, *args, **kwargs):

		language_code = self.request.session.get('current_language_code')
		
		user_id = self.kwargs.get('user_id')
		word = self.kwargs.get('word')

		#serializer = UserToggleKnownWordSerializer(data=request.data)
		serializer = UserToggleKnownWordSerializer(data={'user_id': user_id, 'word': word})

		if serializer.is_valid():

			user_id = serializer.validated_data['user_id']
			word = serializer.validated_data['word']

			word_data_model = {
				'th': ThWordData
			}.get(language_code, 'th')

			user = AppUser.objects.get(user_id=user_id)
			word_obj = word_data_model.objects.get(word=word)

			# Get the UserWord object for this user and word
			user_word_obj, created = UserWord.objects.get_or_create(
				user=user,
				**{f'word_{language_code}': word_obj}
			)

			# Check if a user knows a word
			if created:
				word_added = True
				#user.known_words.add(user_word_obj)
			else:
				word_added = False
				user.known_words.remove(user_word_obj)

			return Response({
				"status": "success",
				"word_added": word_added
				})

		else:

			return Response(serializer.errors, status=400)


class UserWordCountsView(APIView):
	"""Returns the total number of words the user knows in each 'bucket'
	of word frequency. I.e. how many words they know out of the 1000
	most frequent words, 1001-2000 most frequent etc.
	"""

	serializer_class = UserWordCountsSerializer()

	def get(self, request, *args, **kwargs):

		language_code = self.request.session.get('current_language_code')
		user_id = self.kwargs['user_id']

		user_words = UserWord.objects.filter(
    		user_id=user_id,
    		**{f'word_{language_code}': OuterRef('pk')}
			)

		words_data_obj = {
			'th': ThWordData
		}.get(language_code, 'th')
        
		# queryset contains all words in [Lang]WordData with annotation to say whether
		# the current user knows each word
		queryset = words_data_obj.objects.annotate(user_knows=Exists(user_words)).filter(user_knows=True)

		counts = queryset.aggregate(**{
			'1-1000': Count('id', filter=Q(id__range=(1, 1000))),
			'1001-2000': Count('id', filter=Q(id__range=(1001, 2000))),
			'2001-3000': Count('id', filter=Q(id__range=(2001, 3000))),
			'3001-4000': Count('id', filter=Q(id__range=(3001, 4000))),
			'4001-5000': Count('id', filter=Q(id__range=(4001, 5000))),
			'5000+': Count('id', filter=Q(id__gt=5000))
		})
		
		return Response(counts)


class CurrentUserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	##

	def get(self, request):
		serializer = UserSerializer(
			request.user,
			context={
				'user': request.user,
				'request': request
				})
		return Response({'user': serializer.data}, status=status.HTTP_200_OK)


class UserViewSet(generics.ListAPIView):

	serializer_class = UserSerializer
	#permission_classes = (permissions.IsAuthenticated,)
	#authentication_classes = (SessionAuthentication,)

	def get_queryset(self):
		queryset = AppUser.objects.all()
		search_term = self.request.query_params.get('search', None)
        
		if search_term is not None:
			# Limit to just the first 10 results for now
			queryset = queryset.filter(Q(username__icontains=search_term))[:10]

		return queryset

	def get_serializer_context(self):
		context = super().get_serializer_context()
		context.update({"user": self.request.user})
		return context


class LanguagesViewSet(viewsets.ModelViewSet):
	queryset = Language.objects.all()
	serializer_class = LanguageModelSerializer


class SentencesViewSet(viewsets.ModelViewSet):

	def get_serializer_class(self):
		# TODO: Not restful. Need to store this state on the frontend
		language_code = self.request.session.get('current_language_code')
		
		return {
			'th': ThSentenceModelSerializer,
			}.get(language_code, 'th')
	
	def get_queryset(self):

		language_code = self.request.session.get('current_language_code')
		percentage_known_words = self.kwargs['perc_known_words']
		tolerance = 60
		
		model = {
			'th': ThSentence
			}.get(language_code, 'th')
		
		# Select a random offset.
		# TODO: This could lead to related groups of sentences being fetched together
		# I should randomly order them when preparing the dataset
		num_sentences = 200 if language_code == 'th' else 20000

		# ----------------------------
		queryset = model.objects.filter(
			average_count_rank__gte = 0
			)
		# ----------------------------

		queryset_count = queryset.count()
		random_index = random.randint(0, queryset_count - (num_sentences + 1))
		queryset = queryset[random_index:random_index + num_sentences]

		user_words = UserWord.objects.filter(user=self.request.user, **{f"word_{language_code}__isnull": False}).all()

		# Get the words in the specific language for the user
		known_words = set(user_words.values_list(f'word_{language_code}__word', flat=True))

		# Generator returns once 20 sentences meeting criteria have been
		# chosen and doesn't create a new 200-item list in memory. Passing
		# queryset into local namespace will also save some time

		def gen(queryset, known_words, percentage_known_words, tolerance):
			count = 0
			tolerance_counter = 0
			for item in queryset.iterator():

				# Very inefficient but increase tolerance by 10% if not returned 20 values after n iterations
				if tolerance_counter == 5000:
					tolerance += 10
					tolerance_counter = 0
				
				tolerance_counter += 1

				words = set(item.words)
				# Avoid costly division by multiplying other terms by denominator
				num_words = len(words)
				if (percentage_known_words - tolerance) * num_words <= len(words.intersection(known_words)) * 100 <= (percentage_known_words + tolerance) * num_words:
					yield item
					count += 1
					if count == 20: return
		
		# Remove list() conversion, this is just to consume the generator so it shows up in the line profiler
		return gen(queryset, known_words, percentage_known_words, tolerance) if language_code != 'th' else queryset[:20]
	

class WordDataView(APIView):
	# Trop de donnees pour mettre dans l'url donc il faut utiliser post
	def post(self, request, *args, **kwargs):

		# Get current language from user session data
		language_code = request.session.get('current_language_code')

		words = request.data.get('words', [])
		start_index = request.data.get('start_index', 0)
		end_index = request.data.get('end_index', 100)

		model = {
			'th': ThWordData
		}.get(language_code, 'th')
		
		# Deux manieres de chercher des mots. Soit on peut specifier
		# quels mots on veut chercher, soit on fournit deux index
		if words == []:
			queryset = model.objects.filter(
				rank__range=(start_index, end_index)
			).order_by('rank')
		else:
			# Remove duplicate words
			unique_words = list(set(words))

			queryset = model.objects.filter(word__in=unique_words)
	
		serializer_obj = {
			'th': ThWordDataModelSerializer
		}.get(language_code, 'th')
		
		serializer = serializer_obj(
			queryset,
			many=True,
			context={'request': request}
			)

		# flatten list of dictionaries into single dictionary with word
		# as the key and word data dictionary as the value
		word_data = {k: v for d in serializer.data for k, v in d.items()}

		return Response(word_data)


def csrf(request):
	# CSRF sert a proteger contre des attaques dans un navigateur. Or,
	# cette api ne sera utilise que pour cette application mobile, mais
	# je le garderai quand-meme au cas ou je veux reutiliser l'api pour
	# un site web
	return JsonResponse({'csrfToken': get_token(request)})