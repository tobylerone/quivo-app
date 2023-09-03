from django.db import models

# Create your models here.
class RuSentence(models.Model):
    sentence = models.TextField()
    difficulty_score = models.DecimalField(decimal_places=4, max_digits=10)