from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, mixins
from rest_framework.parsers import MultiPartParser, FormParser

from django.views import generic

from case_management.serializers import CaseOfficeSerializer, CaseTypeSerializer, ClientSerializer, LegalCaseSerializer, MeetingSerializer, UserSerializer, LogSerializer, LegalCaseFileSerializer
from case_management.models import CaseOffice, CaseType, Client, LegalCase, Meeting, User, Log, LegalCaseFile

import time

class UpdateRetrieveViewSet(
        mixins.UpdateModelMixin,
        mixins.RetrieveModelMixin,
        viewsets.GenericViewSet):
    """
    A viewset that provides just the `update', and `retrieve` actions.

    To use it, override the class and set the `.queryset` and
    `.serializer_class` attributes.
    """
    pass

class CreateListRetrieveViewSet(
        mixins.CreateModelMixin,
        mixins.ListModelMixin,
        mixins.RetrieveModelMixin,
        viewsets.GenericViewSet):
    """
    A viewset that provides just the `create', 'list', and `retrieve` actions.

    To use it, override the class and set the `.queryset` and
    `.serializer_class` attributes.
    """
    pass


class Index(generic.TemplateView):
    template_name = "index.html"


class CustomObtainAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
        })


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

    def perform_create(self, serializer):
        last_id = LegalCase.objects.latest('id').id + 1
        case_office = CaseOffice.objects.get(pk=self.request.data['case_offices'][0])
        case_office_code = case_office.case_office_code
        generated_case_number = f'{case_office_code}/{time.strftime("%y%m")}/{str(last_id).zfill(4)}'
        serializer.save(case_number=generated_case_number)


class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['legal_case']


class UserViewSet(UpdateRetrieveViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class LogViewSet(CreateListRetrieveViewSet):
    queryset = Log.objects.all()
    serializer_class = LogSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['parent_id', 'parent_type', 'target_id', 'target_type']

class LegalCaseFileViewSet(viewsets.ModelViewSet):
    parser_classes = (MultiPartParser, FormParser)
    queryset = LegalCaseFile.objects.all()
    serializer_class = LegalCaseFileSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['legal_case']
