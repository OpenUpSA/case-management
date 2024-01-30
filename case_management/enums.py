from django.db import models


class PermissionGroups(models.TextChoices):
    ADMIN = 'Admin'
    REPORTING = ('Reporting',)
    ADVICE_OFFICE_ADMIN = 'AdviceOfficeAdmin', 'Office Admin'
    CASE_WORKER = 'CaseWorker', 'Case Worker'


class LogChangeTypes(models.TextChoices):
    CHANGE = 'Change'
    ADD = 'Add'
    REMOVE = 'Remove'


class OfficialIdentifiers(models.TextChoices):
    NATIONAL_ID = 'National', 'National Identity Number'
    PASSPORT_NUMBER = 'Passport', 'Passport Number'
    REFUGEE_PASSPORT_ID_NUMBER = 'RefugeePassport', 'Refugee Passport ID Number'
    SECTION_24_PERMIT_ID_NUMBER = (
        'Section22AsylymSeekerVisa',
        'Section 22 Asylym Seeker Visa ID Number',
    )
    SECTION_24_PERMIT_FILE_NUMBER = (
        'Section24RefugeePermit',
        'Section 24 Refugee Permit File Number',
    )


class CaseStates(models.TextChoices):
    OPENED = 'Opened', 'Opened'
    IN_PROGRESS = 'In Progress', 'In Progress'
    HANGING = 'Hanging', 'Hanging'
    PENDING = 'Pending', 'Pending'
    REFERRED = 'Referred', 'Referred'
    RESOLVED = 'Resolved', 'Resolved'
    ESCALATED = 'Escalated', 'Escalated'
    CLOSED = 'Closed', 'Closed'


class EmploymentStatus(models.TextChoices):
    EMPLOYED = 'Employed'
    UNEMPLOYED = 'Unemployed'
    NOT_ECONOMICALLY_ACTIVE = 'NotEconomicallyActive', 'Not Economically Active'


class Genders(models.TextChoices):
    MALE = 'Male'
    FEMALE = 'Female'
    OTHER = 'Other'
    PREFER_NOT_TO_SAY = 'PreferNotToSay', 'Prefer Not To Say'


class MaritalStatuses(models.TextChoices):
    CIVIL_MARRIAGE = 'CivilMarriage', 'Civil Marriage'
    CUSTOMARY_MARRIAGE = 'CustomaryMarriage', 'Customary Marriage'
    DIVORCED = 'Divorced'
    SINGLE = 'Single'
    WIDOWED = 'Widowed'


class CivilMarriageTypes(models.TextChoices):
    IN_COMMUNITY = 'InCommunity', 'In Community Of Property'
    OUT_OF_COMMUNITY_WITH_ACCRUAL = (
        'OutOfCommunityWithAccrual',
        'Out Of Community Of Propery Subject To Accrual',
    )
    OUT_OF_COMMUNITY_NO_ACCRUAL = (
        'OutOfCommunityNoAccrual',
        'Out Of Community Of Propery No Accrual',
    )


class Provinces(models.TextChoices):
    EC = 'EasternCape', 'Eastern Cape'
    FS = 'Freestate'
    GP = 'Gauteng'
    KZN = 'KwaZuluNatal', 'KwaZulu-Natal'
    LP = 'Limpopo'
    MP = 'Mpumalanga'
    NC = 'NorthernCape', 'Northern Cape'
    NW = 'NorthWest', 'North West'
    WC = 'WesternCape', 'Western Cape'


class ContactMethods(models.TextChoices):
    Call = 'Call', 'Phone Call'
    SMS = 'SMS', 'SMS'
    WhatsApp = 'WhatsApp', 'WhatsApp/messenger'
    Email = 'Email', 'Email'


class Relationships(models.TextChoices):
    AUNT = 'Aunt'
    BROTHER = 'Brother'
    CHILD = 'Child'
    COUSIN = 'Cousin'
    DAUGHTER = 'Daughter'
    DAUGHTER_IN_LAW = 'Daughter In-Law'
    FATHER = 'Father'
    FATHER_IN_LAW = 'Father In-Law'
    GRANDCHILD = 'Grandchild'
    GRANDDAUGHTER = 'Granddaughter'
    GRANDFATHER = 'Grandfather'
    GRANDMOTHER = 'Grandmother'
    GRANDPARENT = 'Grandparent'
    GRANDSON = 'Grandson'
    GREAT_GRANDFATHER = 'Great-Grandfather'
    GREAT_GRANDMOTHER = 'Great-Grandmother'
    GREAT_GRANDPARENT = 'Great-Grandparent'
    GUARDIAN = 'Guardian'
    IN_LAW = 'In-Law'
    MOTHER = 'Mother'
    MOTHER_IN_LAW = 'Mother In-Law'
    NEPHEW = 'Nephew'
    NIECE = 'Niece'
    OTHER = 'Other'
    PARENT = 'Parent'
    SIBLING = 'Sibling'
    SISTER = 'Sister'
    SON = 'Son'
    SON_IN_LAW = 'Son In-Law'
    SPOUSE = 'Spouse'
    UNCLE = 'Uncle'
