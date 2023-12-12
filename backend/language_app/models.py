from django.db import models

class Language(models.Model):
    language_code = models.TextField(null=False)
    language_name = models.TextField(null=False)

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

class FrWordData(models.Model):
    rank = models.DecimalField(decimal_places=1, max_digits=10, null=True)
    word = models.TextField(null=True)
    frequency = models.DecimalField(decimal_places=1, max_digits=10, null=True)
