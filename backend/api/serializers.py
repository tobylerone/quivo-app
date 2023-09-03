from rest_framework import serializers
from ..models import RuSentence

class RuSentenceModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = RuSentence
        fields = ("id", "sentence", "difficulty_score")