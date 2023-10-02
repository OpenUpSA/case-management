from django.contrib.auth.admin import UserAdmin
from django.contrib import admin

from case_management.models import (
    LegalCase,
    CaseOffice,
    CaseType,
    Client,
    CaseUpdate,
    File,
    Meeting,
    Note,
    User,
    Log,
    Language
)
from case_management.forms import UserCreationForm, UserChangeForm


class DefaultAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return True

    def has_change_permission(self, request, obj=None):
        return True

    def has_delete_permission(self, request, obj=None):
        return True

    def has_module_permission(self, request):
        return True


class UserAdmin(UserAdmin, DefaultAdmin):
    add_form = UserCreationForm
    form = UserChangeForm
    model = User
    list_display = (
        'name_or_email',
        'case_office',
        'is_staff',
        'is_active',
        'permission_group',
    )
    list_filter = (
        'name',
        'case_office',
        'email',
        'is_staff',
        'is_active',
        'permission_group',
    )
    fieldsets = (
        (
            None,
            {
                'fields': (
                    'email',
                    'password',
                    'name',
                    'membership_number',
                    'contact_number',
                    'case_office',
                )
            },
        ),
        ('Permissions', {
         'fields': ('is_staff', 'is_active', 'permission_group')}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': (
                    'email',
                    'password1',
                    'password2',
                    'is_staff',
                    'is_active',
                    'permission_group',
                ),
            },
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)

    def name_or_email(self, obj):
        return obj.name if obj.name else obj.email


class CaseOfficeAdmin(DefaultAdmin):
    model = CaseOffice
    list_display = ['name']
    list_filter = ['name']


class CaseTypeAdmin(DefaultAdmin):
    model = CaseType
    list_display = ['title']
    list_filter = ['title']


class ClientAdmin(DefaultAdmin):
    model = Client
    list_display = ['first_names', 'last_name',
                    'province', 'officers', 'created_at']
    list_filter = ['province', 'created_at']

    def officers(self, obj):
        return "\n".join([p.name for p in obj.users.all()])


class LegalCaseAdmin(DefaultAdmin):
    model = LegalCase
    list_display = [
        'case_number',
        'client',
        'state',
        'types',
        'offices',
        'officers',
        'created_at',
    ]
    list_filter = ['case_number', 'client', 'state', 'created_at']

    def types(self, obj):
        return "\n".join([p.title for p in obj.case_types.all()])

    def offices(self, obj):
        return "\n".join([p.name for p in obj.case_offices.all()])

    def officers(self, obj):
        return "\n".join([p.name for p in obj.users.all()])


class CaseUpdateAdmin(DefaultAdmin):
    model = CaseUpdate
    list_display = ['legal_case', 'files', 'meeting', 'note']


class FileAdmin(DefaultAdmin):
    model = File
    list_display = ['legal_case', 'upload']


class MeetingAdmin(DefaultAdmin):
    model = Meeting
    list_display = ['location', 'legal_case']
    list_filter = ['location', 'legal_case']


class NoteAdmin(DefaultAdmin):
    model = Note
    list_display = ['legal_case', 'title']


class LogAdmin(DefaultAdmin):
    model = Log
    list_display = ['action', 'target_type']

class LanguageAdmin(DefaultAdmin):
    model = Language
    list_display = ['label', ]


admin.site.register(CaseType, CaseTypeAdmin)
admin.site.register(CaseOffice, CaseOfficeAdmin)
admin.site.register(Client, ClientAdmin)
admin.site.register(LegalCase, LegalCaseAdmin)
admin.site.register(CaseUpdate, CaseUpdateAdmin)
admin.site.register(File, FileAdmin)
admin.site.register(Meeting, MeetingAdmin)
admin.site.register(Note, NoteAdmin)
admin.site.register(Log, LogAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Language, LanguageAdmin)