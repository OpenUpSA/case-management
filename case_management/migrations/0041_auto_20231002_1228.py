# Generated by Django 3.2.21 on 2023-10-02 12:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('case_management', '0040_language'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='client',
            name='home_language',
        ),
        migrations.RemoveField(
            model_name='client',
            name='translator_language',
        ),
    ]
