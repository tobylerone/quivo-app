from rest_framework import viewsets
from language_app.models import FrSentence
from .serializers import FrSentenceModelSerializer

class FrSentencesViewSet(viewsets.ModelViewSet):
    queryset = FrSentence.objects.all()
    serializer_class = FrSentenceModelSerializer