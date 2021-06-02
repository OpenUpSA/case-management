from django.views import generic
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .serializers import CaseOfficeSerializer, CaseTypeSerializer
from .models import CaseOffice, CaseType


class Index(generic.TemplateView):
    template_name = "index.html"


@api_view(['GET'])
def case_offices(_request):
    data = CaseOffice.objects.order_by("name")
    serializer = CaseOfficeSerializer(data, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def case_types(_request):
    data = CaseType.objects.order_by("title")
    serializer = CaseTypeSerializer(data, many=True)

    return Response(serializer.data)
