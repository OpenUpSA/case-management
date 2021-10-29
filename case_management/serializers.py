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

    def validate_official_identifier_type(self, official_identifier_type_value):
        official_identifier = self.initial_data.get('official_identifier')
        if official_identifier is not None and official_identifier_type_value is None:
            raise serializers.ValidationError({
                'official_identifier_type': f'official_identifier_type is mandatory if official_identifier is provided'
            })
        return official_identifier_type_value

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