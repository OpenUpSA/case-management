# Generated by Django 3.2.4 on 2021-11-04 21:21

import django.core.validators
from django.db import migrations, models
import django_countries.fields
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('case_management', '0015_auto_20211029_2158'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='address',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='client',
            name='civil_marriage_type',
            field=models.CharField(blank=True, choices=[('InCommunity', 'In Community Of Property'), ('OutOfCommunityWithAccrual', 'Out Of Community Of Propery Subject To Accrual'), ('OutOfCommunityNoAccrual', 'Out Of Community Of Propery No Accrual')], max_length=25),
        ),
        migrations.AddField(
            model_name='client',
            name='date_of_birth',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='client',
            name='dependents',
            field=models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AddField(
            model_name='client',
            name='disabilities',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='client',
            name='employment_status',
            field=models.CharField(blank=True, choices=[('Employed', 'Employed'), ('Unemployed', 'Unemployed'), ('NotEconomicallyActive', 'Not Economically Active')], max_length=25),
        ),
        migrations.AddField(
            model_name='client',
            name='gender',
            field=models.CharField(blank=True, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other'), ('PreferNotToSay', 'Prefer Not To Say')], max_length=20),
        ),
        migrations.AddField(
            model_name='client',
            name='has_disability',
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='client',
            name='home_language',
            field=models.CharField(blank=True, choices=[('Afrikaans', 'Afrikaans'), ('English', 'English'), ('French', 'French'), ('isiNdebele', 'Isindebele'), ('isiXhosa', 'Isixhosa'), ('isiZulu', 'Isizulu'), ('Sepedi', 'Sepedi'), ('Sesotho', 'Sesotho'), ('Setswana', 'Setswana'), ('siSwati', 'Siswati'), ('Tshivenda', 'Tshivenda'), ('Xitsonga', 'Xitsonga'), ('Other', 'Other')], max_length=20),
        ),
        migrations.AddField(
            model_name='client',
            name='marital_status',
            field=models.CharField(blank=True, choices=[('CivilMarriage', 'Civil Marriage'), ('CustomaryMarriage', 'Customary Marriage'), ('Divorced', 'Divorced'), ('Single', 'Single'), ('Widowed', 'Widowed')], max_length=20),
        ),
        migrations.AddField(
            model_name='client',
            name='nationality',
            field=django_countries.fields.CountryField(blank=True, max_length=2),
        ),
        migrations.AddField(
            model_name='client',
            name='next_of_kin_contact_number',
            field=phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, region=None),
        ),
        migrations.AddField(
            model_name='client',
            name='next_of_kin_name',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='client',
            name='next_of_kin_relationship',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='client',
            name='province',
            field=models.CharField(blank=True, choices=[('EasternCape', 'Eastern Cape'), ('Freestate', 'Fs'), ('Gauteng', 'Gp'), ('KwaZuluNatal', 'KwaZulu-Natal'), ('Limpopo', 'Lp'), ('Mpumalanga', 'Mp'), ('NorthernCape', 'Northern Cape'), ('NorthWest', 'North West'), ('WesternCape', 'Western Cape')], max_length=20),
        ),
        migrations.AddField(
            model_name='client',
            name='translator_language',
            field=models.CharField(blank=True, choices=[('Afrikaans', 'Afrikaans'), ('English', 'English'), ('French', 'French'), ('isiNdebele', 'Isindebele'), ('isiXhosa', 'Isixhosa'), ('isiZulu', 'Isizulu'), ('Sepedi', 'Sepedi'), ('Sesotho', 'Sesotho'), ('Setswana', 'Setswana'), ('siSwati', 'Siswati'), ('Tshivenda', 'Tshivenda'), ('Xitsonga', 'Xitsonga'), ('Other', 'Other')], max_length=20),
        ),
        migrations.AddField(
            model_name='client',
            name='translator_needed',
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='client',
            name='official_identifier',
            field=models.CharField(blank=True, max_length=64, null=True),
        ),
        migrations.AlterField(
            model_name='client',
            name='official_identifier_type',
            field=models.CharField(blank=True, choices=[('National', 'National Identity Number'), ('Passport', 'Passport Number'), ('RefugeePassport', 'Refugee Passport ID Number'), ('Section22AsylymSeekerVisa', 'Section 22 Asylym Seeker Visa ID Number'), ('Section24RefugeePermit', 'Section 24 Refugee Permit File Number')], max_length=25, null=True),
        ),
    ]
