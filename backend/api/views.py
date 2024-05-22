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
from .models import AppUser, UserFollow, UserWord

from language_app.models import Language, FrSentence, DeSentence, RuSentence, ThSentence, FrWordData, DeWordData, RuWordData, ThWordData
from .serializers import (
    UserRegisterSerializer,
    UserLoginSerializer,
    UserFollowSerializer,
	UserToggleKnownWordSerializer,
	UserAddLanguageSerializer,
	UserChangeAvatarSerializer,
	UserWordCountsSerializer,
	UserMonthlyKnownWordsSerializer,
    UserSerializer,
	LanguageModelSerializer,
    FrSentenceModelSerializer,
	DeSentenceModelSerializer,
	RuSentenceModelSerializer,
	ThSentenceModelSerializer,
    FrWordDataModelSerializer,
	DeWordDataModelSerializer,
	RuWordDataModelSerializer,
	ThWordDataModelSerializer
	)

from .validations import custom_validation, validate_username, validate_password

import line_profiler
profile = line_profiler.LineProfiler()

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
			if language_code in ['fr', 'de', 'ru', 'th']:

				request.session['current_language_code'] = language_code
				return Response(status=status.HTTP_200_OK)
		except Exception as e:
			print(e)


class UserGetCurrentLanguageView(APIView):
	def get(self, request):
		return Response(request.session['current_language_code'], status=200)


class UserAddLanguageView(APIView):
	
		def post(self, request, *args, **kwargs):

			serializer = UserAddLanguageSerializer(data=request.data)

			if serializer.is_valid():
				
				user = serializer.save()
				return Response({"status": "success"})
			else:
				print(serializer.errors)
				return Response(serializer.errors, status=400)


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


class UserIncrementStreakView(APIView):
	def update(self, request, *args, **kwargs):
		user_id = request.data.get('user_id')
		user = AppUser.objects.get(user_id=user_id)

		#serializer = UserIncrementStreakSerializer()
		user.streak += 1
		user.save()


class UserKnownLanguagesView(generics.ListAPIView):

	serializer_class = LanguageModelSerializer

	def get_queryset(self):
		user_id = self.kwargs['user_id']
		user = AppUser.objects.get(user_id=user_id)
		
		return user.known_languages.all()
	
	# Why do I need this?
	def get_serializer_context(self):
		context = super().get_serializer_context()
		context.update({"user": self.request.user})
		return context


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

class UserFollowingView(generics.ListAPIView):

	serializer_class = UserSerializer

	def get_queryset(self):
		user_id = self.kwargs['user_id']
		user = AppUser.objects.get(user_id=user_id)
		
		return user.following.all()
	
	def get_serializer_context(self):
		context = super().get_serializer_context()
		context.update({"user": self.request.user})
		return context
	

class UserFollowersView(generics.ListAPIView):
	serializer_class = UserSerializer

	def get_queryset(self):
		user_id = self.kwargs['user_id']
		user = AppUser.objects.get(user_id=user_id)

		return user.followed_by.all()
	
	def get_serializer_context(self):
		context = super().get_serializer_context()
		context.update({"user": self.request.user})
		return context


class UserWordsView(generics.ListAPIView):
	serializerClass = FrWordDataModelSerializer

	def get_queryset(self):
		user_id = self.kwargs['user_id']
		user = AppUser.objects.get(user_id=user_id)

		return user.known_words.all()


class UserFollowView(APIView):
	def post(self, request, follower_id, followee_id):
		serializer = UserFollowSerializer(
			data={
				'follower': follower_id,
		 		'followee': followee_id
				}
			)

		if serializer.is_valid():

			# TODO: Ensure user can't follow themselves

			# Get the follow record
			follow_record = UserFollow.objects.filter(follower=follower_id, followee=followee_id)

            # If the follow record already exists, don't replicate it
			if follow_record.exists():
				return Response({"message": "User already being followed by this account"}, status=status.HTTP_409_CONFLICT)
			
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserUnfollowView(APIView):
    def delete(self, request, follower_id, followee_id):
        serializer = UserFollowSerializer(
			data={
				'follower': follower_id,
		 		'followee': followee_id
				}
			)
        if serializer.is_valid():

            # Get the follow record
            follow_record = UserFollow.objects.filter(follower=follower_id, followee=followee_id)

            # If the follow record exists, delete it
            if follow_record.exists():
                follow_record.delete()
                return Response({"message": "Successfully unfollowed"}, status=status.HTTP_200_OK)
            
            return Response({"message": "Follow record not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserToggleKnownWordView(APIView):

	@profile
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
				'fr': FrWordData,
				'de': DeWordData,
				'ru': RuWordData,
				'th': ThWordData
			}.get(language_code, 'fr') # Default to fr for now

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

			with open('output.txt', 'w') as stream:
				profile.print_stats(stream=stream)  

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
			'fr': FrWordData,
			'de': DeWordData,
			'ru': RuWordData,
			'th': ThWordData
		}.get(language_code, 'fr')
        
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
			queryset = queryset.filter(Q(username__icontains=search_term))

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
			'fr': FrSentenceModelSerializer,
			'de': DeSentenceModelSerializer,
			'ru': RuSentenceModelSerializer,
			'th': ThSentenceModelSerializer,
			}.get(language_code, 'fr') # Default to fr for now
	
	def get_queryset(self):

		language_code = self.request.session.get('current_language_code')
		percentage_known_words = self.kwargs['perc_known_words']
		tolerance = 60
		
		model = {
			'fr': FrSentence,
			'de': DeSentence,
			'ru': RuSentence,
			'th': ThSentence
			}.get(language_code, 'fr')
		
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

		# This must be the same as map used to create word frequency dataset
		shortened_word_map = {
			'j': 'je',
			'l': 'le', # Always replace with le for now. Figure out a better solution here
			't': 'tu', # This will assign the t in a-t-on to tu for example, which will give tu a higher frequency than it should have, but it's only one very common word so I'm not going to address it
			'd': 'de', # Need to check whether this is ever du
			'c': 'ce',
			's': 'se',
			'qu': 'que',
			'm': 'me',
			'n': 'ne',
		}

		# Get current language from user session data
		language_code = request.session.get('current_language_code')

		words = request.data.get('words', [])
		start_index = request.data.get('start_index', 0)
		end_index = request.data.get('end_index', 100)

		model = {
			'fr': FrWordData,
			'de': DeWordData,
			'ru': RuWordData,
			'th': ThWordData
		}.get(language_code, 'fr')
		
		# Deux manieres de chercher des mots. Soit on peut specifier
		# quels mots on veut chercher, soit on fournit deux index
		if words == []:
			queryset = model.objects.filter(
				rank__range=(start_index, end_index)
			).order_by('rank')
		else:
			# Remove duplicate words
			unique_words = list(set(words))

			if language_code == 'fr':

				# Replace any shortened words with the full word
				unique_words = [shortened_word_map.get(word, word) for word in unique_words]

			queryset = model.objects.filter(word__in=unique_words)
	
		serializer_obj = {
			'fr': FrWordDataModelSerializer,
			'de': DeWordDataModelSerializer,
			'ru': RuWordDataModelSerializer,
			'th': ThWordDataModelSerializer
		}.get(language_code, 'fr')
		
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