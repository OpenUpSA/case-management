# Generated by Django 3.2.4 on 2021-10-13 09:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('case_management', '0011_log'),
    ]

    operations = [
        migrations.AddField(
            model_name='log',
            name='parent_type',
            field=models.CharField(default='LegalCase', max_length=255),
        ),
    ]
