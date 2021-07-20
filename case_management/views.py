from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets

from django.views import generic
from rest_framework.response import Response
from rest_framework.decorators import api_view

from case_management.serializers import CaseOfficeSerializer, CaseTypeSerializer, ClientSerializer, LegalCaseSerializer, MeetingSerializer
from case_management.models import CaseOffice, CaseType, Client, LegalCase, Meeting


class Index(generic.TemplateView):
    template_name = "index.html"


class CaseOfficeViewSet(viewsets.ModelViewSet):
    queryset = CaseOffice.objects.all()
    serializer_class = CaseOfficeSerializer


class CaseTypeViewSet(viewsets.ModelViewSet):
    queryset = CaseType.objects.all()
    serializer_class = CaseTypeSerializer


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer


class LegalCaseViewSet(viewsets.ModelViewSet):
    queryset = LegalCase.objects.all()
    serializer_class = LegalCaseSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['client']


class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['legal_case']
