from rest_framework import viewsets
from ..models import RuSentence
from .serializers import RuSentenceModelSerializer

class RuSentencesViewSet(viewsets.ModelViewSet):
    queryset = RuSentence.objects.all()
    serializer_class = RuSentenceModelSerializer