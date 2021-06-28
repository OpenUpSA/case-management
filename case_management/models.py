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

    def __str__(self):
        return self.preferred_name
