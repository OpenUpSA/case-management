from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from case_management.enums import OfficialIdentifiers, CaseStates
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from case_management.managers import UserManager
from django_lifecycle import LifecycleModel, hook, AFTER_CREATE, AFTER_UPDATE


class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=False, blank=True, default="")
    membership_number = models.CharField(
        max_length=20, null=False, blank=True)
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    contact_number = PhoneNumberField(null=False, blank=True, default="")
    case_office = models.ForeignKey(
        'CaseOffice', related_name='users', on_delete=models.CASCADE, null=True, blank=True)

    username = None
    first_name = None
    last_name = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

    def has_module_perms(self, app_label):
        return self.is_superuser

    def has_perm(self, perm, obj=None):
        return self.is_superuser


def logIt(self, action, parent_id=None, parent_type=None, user=None, note=None):
    if user is None:
        user = User.objects.first()

    if parent_id is None:
        parent_id = self.id

    if parent_type is None:
        parent_type = self.__class__.__name__

    log = Log(parent_id=parent_id,
              parent_type=parent_type,
              target_id=self.id,
              target_type=self.__class__.__name__,
              action=action,
              user=user,
              note='')
    log.save()


class CaseOffice(LifecycleModel, models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=500, unique=True)
    description = models.TextField()

    case_office_code = models.CharField(max_length=3, default="D00")

    @hook(AFTER_CREATE)
    def log_create(self):
        logIt(self, 'Create')

    @hook(AFTER_UPDATE)
    def log_update(self):
        logIt(self, 'Update')

    def __str__(self):
        return self.name


class CaseType(LifecycleModel, models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    title = models.CharField(max_length=255, unique=True)
    description = models.TextField()

    @hook(AFTER_CREATE)
    def log_create(self):
        logIt(self, 'Create')

    @hook(AFTER_UPDATE)
    def log_update(self):
        logIt(self, 'Update')

    def __str__(self):
        return self.title


class Client(LifecycleModel, models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=255, null=False, blank=False)
    preferred_name = models.CharField(max_length=128, null=False, blank=False)
    official_identifier = models.CharField(max_length=64)
    official_identifier_type = models.CharField(max_length=20,
                                                choices=OfficialIdentifiers.choices)
    contact_number = PhoneNumberField()
    contact_email = models.EmailField(max_length=254)

    @hook(AFTER_CREATE)
    def log_create(self):
        logIt(self, 'Create')

    @hook(AFTER_UPDATE)
    def log_update(self):
        logIt(self, 'Update')

    class Meta:
        unique_together = [['official_identifier', 'official_identifier_type']]

    def __str__(self):
        return self.preferred_name


class LegalCase(LifecycleModel, models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    case_number = models.CharField(
        max_length=32, null=False, blank=False, unique=True)
    state = models.CharField(max_length=10,
                             choices=CaseStates.choices)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL)
    client = models.ForeignKey(
        Client, related_name='legal_cases', on_delete=models.CASCADE)
    case_types = models.ManyToManyField(CaseType)
    case_offices = models.ManyToManyField(CaseOffice)

    summary = models.TextField(null=False, blank=True, default="")

    @hook(AFTER_CREATE)
    def log_create(self):
        logIt(self, 'Create')

    @hook(AFTER_UPDATE)
    def log_update(self):
        logIt(self, 'Update')

    def __str__(self):
        return self.case_number


class Meeting(LifecycleModel, models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    legal_case = models.ForeignKey(
        LegalCase, related_name='meetings', on_delete=models.CASCADE)
    location = models.CharField(max_length=255, null=False, blank=False)
    meeting_type = models.CharField(
        max_length=50, null=False, blank=False, default="In person meeting")
    meeting_date = models.DateTimeField(null=False, blank=False)
    notes = models.TextField(null=False, blank=False)
    name = models.CharField(max_length=255, null=False, blank=True, default="")

    @hook(AFTER_CREATE)
    def log_create(self):
        logIt(self, 'Create', parent_id=self.legal_case.id,
              parent_type='LegalCase')

    @hook(AFTER_UPDATE)
    def log_update(self):
        logIt(self, 'Update', parent_id=self.legal_case.id,
              parent_type='LegalCase')

    def __str__(self):
        return f'{self.legal_case.case_number} - {self.id}'


class Log(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    parent_id = models.IntegerField(null=False, blank=False)
    parent_type = models.CharField(
        max_length=255, null=False, blank=False, default='LegalCase')

    target_id = models.IntegerField(null=False, blank=False)
    target_type = models.CharField(max_length=255, null=False, blank=False)

    action = models.CharField(max_length=255, null=False, blank=False)
    user = models.ForeignKey(User, related_name='logs',
                             on_delete=models.CASCADE)

    note = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return f'{self.action} - {self.target_type}'


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
