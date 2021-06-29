from django.contrib.auth.models import User
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from .enums import OfficialIdentifiers


class CaseOffice(models.Model):
    name = models.CharField(max_length=500)
    description = models.TextField()

    def __str__(self):
        return self.name


class CaseType(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.title


class Client(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    preferred_name = models.CharField(max_length=128, null=False, blank=False)
    official_identifier = models.CharField(max_length=64)
    official_identifier_type = models.IntegerField(
        choices=OfficialIdentifiers.choices)
    contact_number = PhoneNumberField()
    contact_email = models.EmailField(max_length=254)
    cases = models.ManyToManyField('Case', blank=True)

    def __str__(self):
        return self.preferred_name


class Case(models.Model):
    case_number = models.CharField(max_length=32, null=False, blank=False)
    clients = models.ManyToManyField(
        'Client', through=Client.cases.through, blank=True)

    users = models.ManyToManyField(User)
    case_types = models.ManyToManyField(CaseType)
    case_offices = models.ManyToManyField(CaseOffice)

    def __str__(self):
        return self.case_number
