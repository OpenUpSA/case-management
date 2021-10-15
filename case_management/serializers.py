from rest_framework import serializers
from case_management.models import CaseOffice, CaseType, Client, LegalCase, Meeting, User, Log, LegalCaseFile


class CaseTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseType
        fields = '__all__'


class LegalCaseSerializer(serializers.ModelSerializer):
    meetings = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    case_number = serializers.CharField(required=False)

    class Meta:
        model = LegalCase
        fields = '__all__'


class ClientSerializer(serializers.ModelSerializer):
    legal_cases = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Client
        fields = '__all__'
        depth = 1


class CaseOfficeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseOffice
        fields = '__all__'


class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = '__all__'


class LogSerializer(serializers.ModelSerializer):
    extra = serializers.ReadOnlyField()
    class Meta:
        model = Log
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'contact_number',
                  'email', 'membership_number', 'case_office']

class LegalCaseFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalCaseFile
        fields = ['id', 'legal_case', 'upload', 'upload_file_name', 'upload_file_extension', 'created_at', 'updated_at']