from rest_framework import serializers
from django_countries.serializers import CountryFieldMixin
from case_management.models import (
    CaseOffice,
    CaseType,
    Client,
    LegalCase,
    Meeting,
    User,
    Log,
    LogChange,
    LegalCaseFile,
)
from case_management.enums import MaritalStatuses


class LogChangeSerializer(serializers.ModelSerializer):

    class Meta:
        model = LogChange
        fields = '__all__'


class LogSerializer(serializers.ModelSerializer):
    changes = LogChangeSerializer(many=True, read_only=True)
    extra = serializers.ReadOnlyField()

    class Meta:
        model = Log
        fields = '__all__'


class CaseTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseType
        fields = '__all__'


class LegalCaseSerializer(serializers.ModelSerializer):
    meetings = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    case_number = serializers.CharField(required=False)

    def validate(self, data):
        if data.get('has_respondent') and not data.get('respondent_name'):
            raise serializers.ValidationError(
                {
                    'respondent_name': 'respondent_name is mandatory if has_respondent is true'
                }
            )
        return data

    class Meta:
        model = LegalCase
        fields = '__all__'


class ClientSerializer(CountryFieldMixin, serializers.ModelSerializer):
    legal_cases = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    updates = LogSerializer(many=True, read_only=True)
    case_offices = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    def validate(self, data):
        if data.get('official_identifier') and not data.get('official_identifier_type'):
            raise serializers.ValidationError(
                {
                    'official_identifier_type': 'official_identifier_type is mandatory if official_identifier is provided'
                }
            )
        if data.get('translator_needed') and not data.get('translator_language'):
            raise serializers.ValidationError(
                {
                    'translator_language': 'translator_language is mandatory if translator_needed is true'
                }
            )
        if data.get(
            'marital_status'
        ) == MaritalStatuses.CIVIL_MARRIAGE and not data.get('civil_marriage_type'):
            raise serializers.ValidationError(
                {
                    'civil_marriage_type': f'civil_marriage_type is mandatory if marital_status is {MaritalStatuses.CIVIL_MARRIAGE}'
                }
            )
        if data.get('has_disability') and not data.get('disabilities'):
            raise serializers.ValidationError(
                {'disabilities': f'disabilities is mandatory if has_disability is true'}
            )
        return data

    class Meta:
        model = Client
        fields = '__all__'


class CaseOfficeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseOffice
        fields = '__all__'


class MeetingSerializer(serializers.ModelSerializer):
    case_offices = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Meeting
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'name',
            'contact_number',
            'email',
            'membership_number',
            'case_office',
            'permission_group'
        ]


class LegalCaseFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalCaseFile
        fields = [
            'id',
            'legal_case',
            'upload',
            'upload_file_name',
            'upload_file_extension',
            'description',
            'created_at',
            'updated_at',
        ]
