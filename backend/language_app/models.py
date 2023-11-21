from django.db import models

# Create your models here.
class FrSentence(models.Model):
    sentence = models.TextField(null=True)
    translated_sentence = models.TextField(null=True)
    #difficulty_score = models.DecimalField(decimal_places=4, max_digits=10)
    cluster = models.IntegerField(null=True)
    words = models.TextField(null=True)
    average_count = models.DecimalField(decimal_places=4, max_digits=20, null=True)
    min_count = models.DecimalField(decimal_places=4, max_digits=20, null=True)
    average_count_rank = models.DecimalField(decimal_places=1, max_digits=20, null=True)
    min_count_rank = models.DecimalField(decimal_places=1, max_digits=20, null=True)
