from rest_framework import serializers
from case_management.models import CaseOffice, CaseType, Client, Case, Meeting


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
        depth = 2

class CaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Case
        fields = '__all__'
        depth = 1

class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = '__all__'
        depth = 1