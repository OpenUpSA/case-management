from django.db import models


class OfficialIdentifiers(models.IntegerChoices):
    NATIONAL_ID = 0, 'National Identity Number'
    PASSPORT_NUMBER = 1, 'Passport Number'
