from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin


class AppUserManager(BaseUserManager):

	def create_user(self, email, password=None):
		if not email:
			raise ValueError('An email is required.')
		if not password:
			raise ValueError('A password is required.')
		email = self.normalize_email(email)
		user = self.model(email=email)
		user.set_password(password)
		user.save()
		return user

	def create_superuser(self, email, password=None):
		if not email:
			raise ValueError('An email is required.')
		if not password:
			raise ValueError('A password is required.')
		user = self.create_user(email, password)
		user.is_superuser = True
		user.save()
		return user


class AppUser(AbstractBaseUser, PermissionsMixin):
	user_id = models.AutoField(primary_key=True)
	email = models.EmailField(max_length=50, unique=True)
	username = models.CharField(max_length=50, unique=True)
	following = models.ManyToManyField(
		'self',
		through='UserFollow',
		related_name='followed_by',
		symmetrical=False
		)
	known_words = models.ManyToManyField('language_app.FrWordData')
	
	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = []
	objects = AppUserManager()

	def following_count(self):
		return self.following.count()
	
	def followers_count(self):
		return self.followed_by.count()
	
	def known_words_count(self):
		return self.known_words.count()

	def __str__(self):
		return self.username
	
class UserFollow(models.Model):
    follower = models.ForeignKey(AppUser, related_name='follower', on_delete=models.CASCADE)
    followee = models.ForeignKey(AppUser, related_name='followee', on_delete=models.CASCADE)
	# Maybe add a field for when followed