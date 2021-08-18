from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, mixins

from django.views import generic

from case_management.serializers import CaseOfficeSerializer, CaseTypeSerializer, ClientSerializer, LegalCaseSerializer, MeetingSerializer, UserSerializer
from case_management.models import CaseOffice, CaseType, Client, LegalCase, Meeting, User


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


class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['legal_case']


class UserViewSet(UpdateRetrieveViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
