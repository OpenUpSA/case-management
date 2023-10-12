# Generated by Django 3.2.21 on 2023-10-06 13:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('case_management', '0043_clientdependent'),
    ]

    operations = [
        migrations.AddField(
            model_name='clientdependent',
            name='relationship_to_client',
            field=models.CharField(blank=True, choices=[('Child', 'Child'), ('Daughter', 'Daughter'), ('Son', 'Son'), ('Father', 'Father'), ('Mother', 'Mother'), ('Spouse', 'Spouse'), ('Sibling', 'Sibling'), ('Other', 'Other')], default='Other', max_length=20, null=True),
        ),
    ]