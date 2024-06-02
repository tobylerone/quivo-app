from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model, authenticate
from .models import UserFollow, UserWord
from language_app.models import FrSentence, DeSentence, RuSentence, ThSentence, FrWordData, DeWordData, RuWordData, ThWordData, Language

UserModel = get_user_model()

class LanguageModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = (
            "id",
            "language_code",
			"language_name",
			"coeffs"
            )


class UserRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = '__all__'
	def create(self, clean_data):
		user_obj = UserModel.objects.create_user(email=clean_data['email'], password=clean_data['password'])
		user_obj.username = clean_data['username']
		user_obj.last_current_language = 'fr' # TODO: Fix this
		user_obj.save()
		return user_obj

class UserLoginSerializer(serializers.Serializer):
	username = serializers.CharField()
	password = serializers.CharField()
	##
	def check_user(self, clean_data):

		user = authenticate(username=clean_data['username'], password=clean_data['password'])

		if not user:
			raise ValidationError('user not found')
		return user

class UserSerializer(serializers.ModelSerializer):

	following_count = serializers.IntegerField(
		read_only=True
		)
	
	followers_count = serializers.IntegerField(
		read_only=True
		)
	
	known_words_count = serializers.JSONField(
		read_only=True
		)

	user_is_following = serializers.SerializerMethodField()

	# Uncomment this to return actual data for known languages (currently retreived by the /knownlanguages endpoint).
	# Otherwise just contains a list of foreign keys (language id)
	#known_languages = LanguageModelSerializer(many=True, read_only=True)

	def get_user_is_following(self, obj):

		# TODO: When called from UserFollowingView, this is redundant as it will
		# always return True, but I don't want to have to add a view field to the
		# context in each view using this serializer to check. Might need to
		# create a new serializer specifically for UserFollowingView inheriting from
		# UserSerializer but leaving as is for now
		# This field is also not required when getting data for the current user
		# (CurrentUserView), so there is definitely need for a core prototype
		# UserSerializer with multiple child classes at some point
		current_user = self.context['user']
		return current_user.following.filter(user_id=obj.user_id).exists()
	
	class Meta:
		model = UserModel
		fields = (
			'user_id',
			'is_premium',
			'has_given_feedback',
			'sound_enabled',
			'autoplay_enabled',
			'narration_speed',
			'email',
			'username',
			'avatar_id',
			'streak',
			'following_count',
			'followers_count',
			'known_languages',
			'known_words_count',
			'user_is_following'
			)


class UserFollowSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserFollow
		fields = ['follower', 'followee']


	def create(self, validated_data):
		print(validated_data)
		return UserFollow.objects.create(**validated_data)
	

class UserToggleKnownWordSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    word = serializers.CharField()


class UserAddLanguageSerializer(serializers.ModelSerializer):
	user_id = serializers.IntegerField()
	language_code = serializers.CharField()

	class Meta:
		model = UserModel
		fields = ['user_id', 'language_code']

	def create(self, validated_data):
		user_id = validated_data.get('user_id')
		language_code = validated_data.get('language_code')

		language = Language.objects.get(language_code=language_code)
		user = UserModel.objects.get(user_id=user_id)

		if language in user.known_languages.all():
			return user

		user.known_languages.add(language)
		
		return user


class UserChangeAvatarSerializer(serializers.ModelSerializer):
	user_id = serializers.IntegerField()
	avatar_id = serializers.CharField()

	class Meta:
		model = UserModel
		fields = ['user_id', 'avatar_id']

	def update(self, instance, validated_data):
		user_id = validated_data.get('user_id')
		avatar_id = validated_data.get('avatar_id')

		user = UserModel.objects.get(user_id=user_id)
		user.avatar_id = avatar_id

		user.save()
		
		return user


class UserWordCountsSerializer(serializers.Serializer):
	counts = serializers.IntegerField()


class UserMonthlyKnownWordsSerializer(serializers.Serializer):
	day = serializers.DateField()
	word_count = serializers.IntegerField()


class BaseSentenceModelSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            "id",
            "sentence",
			"split_sentence",
            "translated_sentence",
            "words",
			"average_count",
			"min_count"
            )
		
class FrSentenceModelSerializer(BaseSentenceModelSerializer):
	class Meta(BaseSentenceModelSerializer.Meta):
		model=FrSentence

class DeSentenceModelSerializer(BaseSentenceModelSerializer):
	class Meta(BaseSentenceModelSerializer.Meta):
		model=DeSentence


class RuSentenceModelSerializer(BaseSentenceModelSerializer):
	class Meta(BaseSentenceModelSerializer.Meta):
		model=RuSentence


class ThSentenceModelSerializer(BaseSentenceModelSerializer):
	class Meta(BaseSentenceModelSerializer.Meta):
		model=ThSentence


class BaseWordDataModelSerializer(serializers.ModelSerializer):

	user_knows = serializers.SerializerMethodField()

	class Meta:
		fields = (
            "id",
            "rank",
            "word",
			"translation",
            "frequency",
			"user_knows"
            )

	def get_user_knows(self, obj):

		request = self.context.get('request')

		if request and request.user:

			language_code = request.session.get('current_language_code')
			#return obj.appuser_set.filter(user_id=request.user.user_id).exists()
			return UserWord.objects.filter(
				user=request.user,
				**{f'word_{language_code}': obj}
			).exists()
		return False
	
	# Override representation to have word as dictionary key
	def to_representation(self, instance):

		# to_representation converts model instance into python dictionary
		# where keys are field names
		representation = super().to_representation(instance)

		# Create and return new dictionary where the word has been moved out to
		# be the key for the entire original dictionary. I then combine this for
		# each word in the view to return { word: word data } in json format 
		return {instance.word: representation}
	

class FrWordDataModelSerializer(BaseWordDataModelSerializer):

	class Meta(BaseWordDataModelSerializer.Meta):
		model = FrWordData


class DeWordDataModelSerializer(BaseWordDataModelSerializer):

	class Meta(BaseWordDataModelSerializer.Meta):
		model = DeWordData


class RuWordDataModelSerializer(BaseWordDataModelSerializer):

	class Meta(BaseWordDataModelSerializer.Meta):
		model = RuWordData


class ThWordDataModelSerializer(BaseWordDataModelSerializer):

	class Meta(BaseWordDataModelSerializer.Meta):
		model = ThWordData