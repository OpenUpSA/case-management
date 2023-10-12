# Generated by Django 3.2.21 on 2023-10-02 11:57

from django.db import migrations, models

DEFAULT_LANGUAGES = {
    'AFRIKAANS': 'Afrikaans',
    'ENGLISH': 'English',
    'FRENCH': 'French',
    'ISINDEBELE': 'isiNdebele',
    'ISIXHOSA': 'isiXhosa',
    'ISIZULU': 'isiZulu',
    'SEPEDI': 'Sepedi',
    'SESOTHO': 'Sesotho',
    'SETSWANA': 'Setswana',
    'SISWATI': 'siSwati',
    'TSHIVENDA': 'Tshivenda',
    'XITSONGA': 'Xitsonga',
    'OTHER': 'Other'
}


def create_languages_from_default_languages(apps, schema_editor):
    Language = apps.get_model('case_management', 'Language')
    for key, value in DEFAULT_LANGUAGES.items():
        Language.objects.create(label=value)


class Migration(migrations.Migration):

    dependencies = [
        ('case_management', '0039_alter_client_date_of_birth'),
    ]

    operations = [
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('label', models.CharField(max_length=255, unique=True)),
            ],
        ),
        migrations.RunPython(create_languages_from_default_languages),

    ]