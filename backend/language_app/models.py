from django.db import models

# Create your models here.
class FrSentence(models.Model):
    sentence = models.TextField()
    translated_sentence = models.TextField()
    difficulty_score = models.DecimalField(decimal_places=4, max_digits=10)
