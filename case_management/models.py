import os
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from case_management.enums import (
    PermissionGroups,
    OfficialIdentifiers,
    CaseStates,
    EmploymentStatus,
    Genders,
    MaritalStatuses,
    CivilMarriageTypes,
    Provinces,
    LogChangeTypes,
    ContactMethods,
    Relationships,
)
from django_countries.fields import CountryField
from django.conf import settings
from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from case_management.managers import UserManager
from django_lifecycle import (
    LifecycleModel,
    hook,
    AFTER_CREATE,
    AFTER_UPDATE,
    BEFORE_DELETE,
)
from django.apps import apps
import ckeditor.fields as ckeditor_fields

LOG_CHANGE_EXCLUDED_FIELDS = ('id', 'created_at', 'updated_at')


class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=False, blank=True, default="")
    membership_number = models.CharField(max_length=20, null=False, blank=True)
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    contact_number = PhoneNumberField(null=False, blank=True, default="")
    case_office = models.ForeignKey(
        'CaseOffice',
        related_name='users',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    username = None
    first_name = None
    last_name = None

    permission_group = models.CharField(
        max_length=20, choices=PermissionGroups.choices, null=True
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

    def has_module_perms(self, app_label):
        return self.is_superuser

    def has_perm(self, perm, obj=None):
        return self.is_superuser


class Language(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    label = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.label

    class Meta:
        ordering = ['label']


class Log(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    parent_id = models.IntegerField(null=False, blank=False)
    parent_type = models.CharField(
        max_length=255, null=False, blank=False, default='LegalCase'
    )

    target_id = models.IntegerField(null=False, blank=False)
    target_type = models.CharField(max_length=255, null=False, blank=False)

    action = models.CharField(max_length=255, null=False, blank=False)
    user = models.ForeignKey(
        User, related_name='logs', null=True, on_delete=models.CASCADE
    )

    note = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return f'{self.action} - {self.target_type}'

    @property
    def extra(self):
        info = {'user': {'name': self.user.name}}
        return info


class LogChange(models.Model):
    id = models.AutoField(primary_key=True)
    log = models.ForeignKey(Log, related_name='changes', on_delete=models.CASCADE)

    field = models.CharField(max_length=255)
    value = models.TextField(null=True)
    action = models.CharField(max_length=10, choices=LogChangeTypes.choices)


def _logChange(log, field, value, action):
    log_change = LogChange(log=log, field=field, value=value, action=action)
    log_change.save()


def logIt(self, action, parent_id=None, parent_type=None, user=None, note=None):
    target_type = self.__class__.__name__
    target_id = self.id

    if parent_id is None:
        parent_id = self.id

    if parent_type is None:
        parent_type = self.__class__.__name__

    if note is None:
        target_model = apps.get_model('case_management', target_type)
        record = target_model.objects.filter(id=target_id)
        if record.count() > 0:
            note = record[0].__str__()
        else:
            note = target_type
    self.log = Log(
        parent_id=parent_id,
        parent_type=parent_type,
        target_id=target_id,
        target_type=target_type,
        action=action,
        user=user,
        note=note,
    )
    self.log.save()
    for field in self._meta.get_fields():
        if (
            hasattr(self, field.name)
            and field.name not in LOG_CHANGE_EXCLUDED_FIELDS
            and (action == 'Create' or self.has_changed(field.name))
        ):
            value = getattr(self, field.name)
            _logChange(self.log, field.name, value, LogChangeTypes.CHANGE)
    return self.log


@receiver(m2m_changed)
def logManyToManyChange(
    sender, instance=None, action=None, model=None, pk_set=None, **kwargs
):
    if action in ('post_add', 'post_remove'):
        if action == 'post_add':
            change_action = LogChangeTypes.ADD
        elif action == 'post_remove':
            change_action = LogChangeTypes.REMOVE
        _, field = sender.__name__.split('_', 1)
        value = list(pk_set)
        if not hasattr(instance, 'log'):
            # logIt has not been called
            logIt(instance, 'Update', user=instance.updated_by)
        _logChange(instance.log, field, value, change_action)


class LoggedModel(LifecycleModel, models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User, related_name='+', on_delete=models.CASCADE, null=True, editable=False
    )
    updated_by = models.ForeignKey(
        User, related_name='+', on_delete=models.CASCADE, null=True, editable=False
    )

    @hook(AFTER_CREATE)
    def log_create(self):
        logIt(self, 'Create', user=self.created_by)

    @hook(AFTER_UPDATE)
    def log_update(self):
        logIt(self, 'Update', user=self.updated_by)

    @hook(BEFORE_DELETE)
    def log_delete(self):
        logIt(self, 'Delete', user=self.updated_by)

    class Meta:
        abstract = True


class LoggedChildModel(LoggedModel):
    """Child models must define field 'legal_case' and optionally 'case_update'"""

    @property
    def case_offices(self):
        return self.legal_case.case_offices

    def save(self, *args, **kwargs):
        if hasattr(self, 'case_update') and self.case_update is not None:
            self.legal_case = self.case_update.legal_case
        super().save(*args, **kwargs)

    def __log(self, action):
        if action == 'Create':
            user = self.created_by
        else:
            user = self.updated_by
        logIt(
            self,
            action,
            parent_id=self.legal_case.id,
            parent_type='LegalCase',
            user=user,
        )

    @hook(AFTER_CREATE)
    def log_create(self):
        self.__log('Create')

    @hook(AFTER_UPDATE)
    def log_update(self):
        self.__log('Update')

    @hook(BEFORE_DELETE)
    def log_delete(self):
        self.__log('Delete')

    class Meta:
        abstract = True


class CaseOffice(LoggedModel):
    name = models.CharField(max_length=500, unique=True)
    description = models.TextField()
    case_office_code = models.CharField(max_length=3, default="D00")

    def __str__(self):
        return self.name


class CaseType(LoggedModel):
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField()

    def __str__(self):
        return self.title


class Client(LoggedModel):
    first_names = models.CharField(max_length=255, null=True, blank=False)
    last_name = models.CharField(max_length=255, null=True, blank=False)
    preferred_name = models.CharField(max_length=128, blank=True)
    official_identifier = models.CharField(max_length=64, null=True, blank=True)
    official_identifier_type = models.CharField(
        max_length=25, choices=OfficialIdentifiers.choices, null=True, blank=True
    )
    date_of_birth = models.DateField(null=True, blank=True)
    contact_number = PhoneNumberField(blank=True)
    alternative_contact_number = PhoneNumberField(blank=True)
    contact_email = models.EmailField(max_length=254, blank=True)
    alternative_contact_email = models.EmailField(max_length=254, blank=True)
    preferred_contact_method = models.CharField(
        max_length=25, blank=True, choices=ContactMethods.choices
    )
    address = models.CharField(max_length=255, blank=True)
    province = models.CharField(max_length=20, blank=True, choices=Provinces.choices)
    gender = models.CharField(max_length=20, blank=True, choices=Genders.choices)
    marital_status = models.CharField(
        max_length=20, blank=True, choices=MaritalStatuses.choices
    )
    civil_marriage_type = models.CharField(
        max_length=25, blank=True, choices=CivilMarriageTypes.choices
    )
    dependents = models.IntegerField(
        validators=[MinValueValidator(0)], blank=True, null=True
    )
    next_of_kin_name = models.CharField(max_length=255, blank=True)
    next_of_kin_relationship = models.CharField(max_length=255, blank=True)
    next_of_kin_contact_number = PhoneNumberField(blank=True)
    home_language = models.ForeignKey(
        Language,
        null=True,
        on_delete=models.CASCADE,
        related_name='home_language',
        blank=True,
    )
    translator_needed = models.BooleanField(blank=True, null=True)
    translator_language = models.ForeignKey(
        Language,
        null=True,
        on_delete=models.CASCADE,
        related_name='translator_language',
        blank=True,
    )
    nationality = CountryField(blank=True)
    country_of_birth = CountryField(blank=True)
    employment_status = models.CharField(
        max_length=25, blank=True, choices=EmploymentStatus.choices
    )
    has_disability = models.BooleanField(blank=True, null=True)
    disabilities = models.CharField(max_length=255, blank=True)

    users = models.ManyToManyField(settings.AUTH_USER_MODEL)

    def save(self, *args, **kwargs):
        if self.preferred_name == '':
            self.preferred_name = self.first_names
        super().save(*args, **kwargs)

    class Meta:
        unique_together = [['official_identifier', 'official_identifier_type']]

    def __str__(self):
        return self.preferred_name

    @property
    def case_offices(self):
        case_offices = CaseOffice.objects.filter(legalcase__client=self)
        return case_offices

    @property
    def updates(self):
        '''TODO: Do this in scalable way e.g. in view using proper join
        The below would not scale, because the request is done for each row
        '''
        updates = Log.objects.filter(target_type='Client', target_id=self.id).order_by(
            '-updated_at'
        )
        return updates


class ClientDependent(LoggedModel):
    client = models.ForeignKey(
        Client, related_name='client_dependents', on_delete=models.CASCADE
    )
    first_names = models.CharField(max_length=255, null=True, blank=False)
    last_name = models.CharField(max_length=255, null=True, blank=False)
    preferred_name = models.CharField(max_length=128, blank=True)
    official_identifier = models.CharField(max_length=64, null=True, blank=True)
    official_identifier_type = models.CharField(
        max_length=25, choices=OfficialIdentifiers.choices, null=True, blank=True
    )
    date_of_birth = models.DateField(null=True, blank=True)
    contact_number = PhoneNumberField(null=True, blank=True)
    alternative_contact_number = PhoneNumberField(null=True, blank=True)
    contact_email = models.EmailField(max_length=254, null=True, blank=True)
    alternative_contact_email = models.EmailField(max_length=254, null=True, blank=True)
    preferred_contact_method = models.CharField(
        max_length=25, null=True, blank=True, choices=ContactMethods.choices
    )
    gender = models.CharField(
        max_length=20, null=True, blank=True, choices=Genders.choices
    )
    relationship_to_client = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        choices=Relationships.choices,
        default='Other',
    )
    home_language = models.ForeignKey(
        Language,
        on_delete=models.CASCADE,
        related_name='dependent_home_language',
        null=True,
        blank=True,
    )
    nationality = CountryField(null=True, blank=True)
    country_of_birth = CountryField(null=True, blank=True)
    details = models.TextField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.preferred_name == '':
            self.preferred_name = self.first_names
        super().save(*args, **kwargs)

    class Meta:
        unique_together = [['official_identifier', 'official_identifier_type']]

    def __str__(self):
        return self.preferred_name

    @property
    def updates(self):
        '''TODO: Do this in scalable way e.g. in view using proper join
        The below would not scale, because the request is done for each row
        '''
        updates = Log.objects.filter(
            target_type='Dependent', target_id=self.id
        ).order_by('-updated_at')
        return updates


class LegalCase(LoggedModel):
    case_number = models.CharField(max_length=32, null=False, blank=False, unique=True)
    state = models.CharField(
        max_length=20, choices=CaseStates.choices, default=CaseStates.OPENED
    )
    users = models.ManyToManyField(settings.AUTH_USER_MODEL)
    client = models.ForeignKey(
        Client, related_name='legal_cases', on_delete=models.CASCADE
    )
    case_types = models.ManyToManyField(CaseType, blank=True)
    case_offices = models.ManyToManyField(CaseOffice)

    summary = models.TextField(null=False, blank=True, default="")
    referred_by = models.CharField(max_length=255, blank=True)
    has_respondent = models.BooleanField(blank=True, null=True)
    respondent_name = models.CharField(max_length=255, blank=True)
    respondent_contact_number = PhoneNumberField(blank=True)

    def __str__(self):
        return self.case_number


class CaseUpdate(LoggedChildModel):
    legal_case = models.ForeignKey(
        LegalCase, related_name='case_updates', on_delete=models.CASCADE
    )

    def __str__(self):
        return f'{self.legal_case.case_number} case update'


class Note(LoggedChildModel):
    case_update = models.OneToOneField(
        CaseUpdate, on_delete=models.CASCADE, related_name='note', null=True, blank=True
    )
    legal_case = models.ForeignKey(
        LegalCase, related_name='notes', on_delete=models.CASCADE, null=True, blank=True
    )
    title = models.CharField(max_length=255, null=False, blank=False)
    content = models.TextField(null=False, blank=False)
    file = models.ForeignKey(
        'File',
        related_name='notes',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.title


class Meeting(LoggedChildModel):
    case_update = models.OneToOneField(
        CaseUpdate,
        on_delete=models.CASCADE,
        related_name='meeting',
        null=True,
        blank=True,
    )
    legal_case = models.ForeignKey(
        LegalCase,
        related_name='meetings',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=255, null=False, blank=True, default="")
    meeting_type = models.CharField(
        max_length=50, null=False, blank=False, default="In person meeting"
    )
    meeting_date = models.DateTimeField(null=False, blank=False)
    location = models.CharField(max_length=255, null=False, blank=False)
    notes = models.TextField(null=False, blank=False)
    advice_was_offered = models.BooleanField(null=True, blank=True)
    advice_offered = models.TextField(null=False, blank=True)
    file = models.ForeignKey(
        'File',
        related_name='meetings',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def __str__(self):
        value = self.name if self.name else self.meeting_type
        date = self.meeting_date.strftime('%d %B %Y')
        return f'{value} on {date}'


class File(LoggedChildModel):
    case_update = models.ForeignKey(
        CaseUpdate,
        related_name='files',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    legal_case = models.ForeignKey(
        LegalCase, related_name='files', on_delete=models.CASCADE, null=True, blank=True
    )
    upload = models.FileField(upload_to='uploads/')
    description = models.CharField(max_length=255, null=False, blank=True, default='')

    def save(self, *args, **kwargs):
        if self.description == '':
            self.description = self.upload_file_name()
        super().save(*args, **kwargs)

    def __str__(self):
        value = self.description if self.description else self.upload_file_name()
        return value

    def upload_file_extension(self):
        return os.path.splitext(self.upload.file.name)[1][1:]

    def upload_file_name(self):
        return os.path.basename(self.upload.file.name)


class ClientFile(LoggedModel):
    client = models.ForeignKey(
        Client, related_name='client_files', on_delete=models.CASCADE
    )
    upload = models.FileField(upload_to='uploads/')
    description = models.CharField(max_length=255, null=False, blank=True, default='')

    def save(self, *args, **kwargs):
        if self.description == '':
            self.description = self.upload_file_name()
        super().save(*args, **kwargs)

    def __str__(self):
        value = self.description if self.description else self.upload_file_name()
        return value

    def upload_file_extension(self):
        return os.path.splitext(self.upload.file.name)[1][1:]

    def upload_file_name(self):
        return os.path.basename(self.upload.file.name)


class SiteNotice(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=False)
    title = models.CharField(max_length=255, null=False, blank=False)
    message = ckeditor_fields.RichTextField(null=False, blank=False)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class Setting(models.Model):
    """
    Model for site-wide settings.
    """

    name = models.CharField(
        max_length=200, help_text="Name of site-wide variable", unique=True
    )
    value = models.JSONField(
        null=True,
        blank=True,
        help_text="Value of site-wide variable that scripts can reference - must be valid JSON",
    )

    def __unicode__(self):
        return self.name


class LegalCaseReferral(LoggedChildModel):
    legal_case = models.ForeignKey(
        LegalCase, related_name='legal_case_referral', on_delete=models.CASCADE, null=True, blank=True
    )
    referred_to = models.CharField(max_length=100, null=False, blank=False, default='')
    reference_number = models.CharField(
        max_length=100, null=False, blank=False, default=''
    )
    referral_date = models.DateField(null=False, blank=False)
    details = models.TextField(null=False, blank=False)
