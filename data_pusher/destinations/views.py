from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Destination
from .serializers import DestinationSerializer

class DestinationViewSet(ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        account_id = self.request.query_params.get('account_id')

        if account_id:
            queryset = queryset.filter(account__account_id=account_id)

        return queryset
