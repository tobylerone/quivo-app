from django.db import models
import json

class Language(models.Model):
    language_code = models.TextField(null=False)
    language_name = models.TextField(null=False)
    # Parameters a, b, c and d of function a + b / (1 + np.exp(-c * x**d)) used to model frequency distribution
    coeffs = models.JSONField(null=False, default=[0, 0, 0, 0])

class BaseSentence(models.Model):

    class Meta:
        abstract=True

    #id = models.BigAutoField(primary_key=True)
    sentence = models.TextField(null=True)
    translated_sentence = models.TextField(null=True)
    cluster = models.IntegerField(null=True)
    words = models.JSONField(null=True) # TODO: Convert this to JSONField
    average_count = models.DecimalField(decimal_places=4, max_digits=20, null=True)
    min_count = models.DecimalField(decimal_places=4, max_digits=20, null=True)
    average_count_rank = models.DecimalField(decimal_places=1, max_digits=20, null=True)
    min_count_rank = models.DecimalField(decimal_places=1, max_digits=20, null=True)

    # Convert words to valid JSON
    def save(self, *args, **kwargs):
        words = self.words[1:-1].split(",")  # Convert string to list
        words = [word.strip() for word in words]  # Remove leading/trailing spaces
        self.words = json.dumps(words)  # Convert list to JSON string

        super().save(*args, **kwargs)


class FrSentence(BaseSentence):
    pass

class DeSentence(BaseSentence):
    pass

class RuSentence(BaseSentence):
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

class RuWordData(BaseWordData):
    pass
