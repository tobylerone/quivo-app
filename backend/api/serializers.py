from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model, authenticate
from .models import UserFollow
from language_app.models import FrSentence, FrWordData

UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = '__all__'
	def create(self, clean_data):
		user_obj = UserModel.objects.create_user(email=clean_data['email'], password=clean_data['password'])
		user_obj.username = clean_data['username']
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
		#source='following_count',
		read_only=True
		)
	
	followers_count = serializers.IntegerField(
		#source='followers_count',
		read_only=True
		)
	
	known_words_count = serializers.IntegerField(
		#source='followers_count',
		read_only=True
		)

	user_is_following = serializers.SerializerMethodField()

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
			'email',
			'username',
			'following_count',
			'followers_count',
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


class UserWordCountsSerializer(serializers.Serializer):
	counts = serializers.IntegerField()


class FrSentenceModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrSentence
        fields = (
            "id",
            "sentence",
            "translated_sentence",
            "words",
			"average_count",
			"min_count"
            )
		
class FrWordDataModelSerializer(serializers.ModelSerializer):
	user_knows = serializers.SerializerMethodField()

	class Meta:
		model = FrWordData
		fields = (
            "id",
            "rank",
            "word",
            "frequency",
			"user_knows"
            )

	def get_user_knows(self, obj):

		request = self.context.get('request')

		if request and request.user:
			return obj.appuser_set.filter(user_id=request.user.user_id).exists()
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
