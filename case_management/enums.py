from django.db import models


class OfficialIdentifiers(models.TextChoices):
    NATIONAL_ID = 'National', 'National Identity Number'
    PASSPORT_NUMBER = 'Passport', 'Passport Number'


class CaseStates(models.TextChoices):
    OPENED = 'Opened', 'Opened'
    IN_PROGRESS = 'InProgress', 'In Progress'
    HANGING = 'Hanging', 'Hanging'
    PENDING = 'Pending', 'Pending'
    REFERRED = 'Referred', 'Referred'
    RESOLVED = 'Resolved', 'Resolved'
    ESCALATED = 'Escalated', 'Escalated'
