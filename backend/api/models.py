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
	
	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = []
	objects = AppUserManager()
	def __str__(self):
		return self.username
	
class UserFollow(models.Model):
    user = models.ForeignKey(AppUser, related_name='user', on_delete=models.CASCADE)
    following = models.ForeignKey(AppUser, related_name='is_following', on_delete=models.CASCADE)
	# Maybe add a field for when followed