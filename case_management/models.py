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


class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    membership_number = models.CharField(
        max_length=20, default='AA/B00/000', null=False, blank=False)
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    contact_number = PhoneNumberField(null=True, blank=True)
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


class CaseOffice(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=500, unique=True)
    description = models.TextField()

    def __str__(self):
        return self.name


class CaseType(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    title = models.CharField(max_length=255, unique=True)
    description = models.TextField()

    def __str__(self):
        return self.title


class Client(models.Model):
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

    class Meta:
        unique_together = [['official_identifier', 'official_identifier_type']]

    def __str__(self):
        return self.preferred_name


class LegalCase(models.Model):
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

    def __str__(self):
        return self.case_number


class Meeting(models.Model):
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

    def __str__(self):
        return f'{self.legal_case.case_number} - {self.id}'


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
