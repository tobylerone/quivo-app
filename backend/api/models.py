from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.validators import MaxValueValidator, MinValueValidator

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
	is_premium = models.BooleanField(default=False)
	has_given_feedback = models.BooleanField(default=False)
	sound_enabled = models.BooleanField(default=True)
	autoplay_enabled = models.BooleanField(default=True)
	narration_speed = models.FloatField(
        default=1,
        validators=[
            MaxValueValidator(1.2),
            MinValueValidator(0.8),
        ]
    )
	email = models.EmailField(max_length=50, unique=True)
	username = models.CharField(max_length=50, unique=True)
	avatar_id = models.IntegerField(default=0)
	streak = models.IntegerField(default=0)
	last_current_language = models.CharField(
		max_length=2,
		unique=False,
		default='fr'
		) # User's language at last logout. Set default to fr for now
	following = models.ManyToManyField(
		'self',
		through='UserFollow',
		related_name='followed_by',
		symmetrical=False
		)
	known_languages = models.ManyToManyField('language_app.Language', blank=True) # Maybe make user need at least one
	known_words = models.ManyToManyField('UserWord', blank=True)

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = []
	objects = AppUserManager()

	def following_count(self):
		return self.following.count()
	
	def followers_count(self):
		return self.followed_by.count()
	
	def known_words_count(self):
	
		known_languages = self.known_languages.all()
		
		word_counts = {}

		for language in known_languages:

			language_code = language.language_code

			# TODO: Not working when I try to access directly, so have to manually filter UserWord to user
			#word_counts[language_code] = self.known_words.filter(**{f'word_{language_code}__isnull': False}).count()
			word_counts[language_code] = UserWord.objects.filter(user=self, **{f"word_{language_code}__isnull": False}).count()

		return word_counts

	def __str__(self):
		return self.username
	
class UserFollow(models.Model):
    follower = models.ForeignKey(AppUser, related_name='follower', on_delete=models.CASCADE)
    followee = models.ForeignKey(AppUser, related_name='followee', on_delete=models.CASCADE)
	# Maybe add a field for when followed

class UserWord(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    word_fr = models.ForeignKey('language_app.FrWordData', on_delete=models.CASCADE, null=True)
    word_de = models.ForeignKey('language_app.DeWordData', on_delete=models.CASCADE, null=True)
    word_ru = models.ForeignKey('language_app.RuWordData', on_delete=models.CASCADE, null=True)
    word_th = models.ForeignKey('language_app.ThWordData', on_delete=models.CASCADE, null=True)
    known_date = models.DateTimeField(auto_now_add=True)