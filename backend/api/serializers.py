from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model, authenticate
from .models import UserFollow
from language_app.models import FrSentence

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
	
	class Meta:
		model = UserModel
		fields = (
			'user_id',
			'email',
			'username',
			'following_count',
			'followers_count'
			)


class UserFollowSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserFollow
		fields = ['follower', 'followee']


	def create(self, validated_data):
		print(validated_data)
		return UserFollow.objects.create(**validated_data)

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
