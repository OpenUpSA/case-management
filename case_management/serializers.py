from rest_framework import serializers
from .models import CaseOffice, CaseType, Client


class CaseOfficeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseOffice
        fields = '__all__'


class CaseTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseType
        fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
