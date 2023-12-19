from django.db import models

class Language(models.Model):
    language_code = models.TextField(null=False)
    language_name = models.TextField(null=False)

class BaseSentence(models.Model):

    class Meta:
        abstract=True

    #id = models.BigAutoField(primary_key=True)
    sentence = models.TextField(null=True)
    translated_sentence = models.TextField(null=True)
    #difficulty_score = models.DecimalField(decimal_places=4, max_digits=10, default=0) # remove
    cluster = models.IntegerField(null=True)
    words = models.TextField(null=True) # TODO: Convert this to JSONField
    average_count = models.DecimalField(decimal_places=4, max_digits=20, null=True)
    min_count = models.DecimalField(decimal_places=4, max_digits=20, null=True)
    average_count_rank = models.DecimalField(decimal_places=1, max_digits=20, null=True)
    min_count_rank = models.DecimalField(decimal_places=1, max_digits=20, null=True)

class FrSentence(BaseSentence):
    pass

class DeSentence(BaseSentence):
    pass

class BaseWordData(models.Model):

    class Meta:
        abstract=True

    rank = models.DecimalField(decimal_places=1, max_digits=10, null=True)
    word = models.TextField(null=True)
    frequency = models.DecimalField(decimal_places=1, max_digits=10, null=True)

class FrWordData(BaseWordData):
    pass

class DeWordData(BaseWordData):
    pass

