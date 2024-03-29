# Generated by Django 3.2.23 on 2024-01-25 12:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('case_management', '0050_alter_setting_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='legalcase',
            name='state',
            field=models.CharField(choices=[('Opened', 'Opened'), ('In Progress', 'In Progress'), ('Hanging', 'Hanging'), ('Pending', 'Pending'), ('Referred', 'Referred'), ('Resolved', 'Resolved'), ('Escalated', 'Escalated'), ('Closed', 'Closed')], default='Opened', max_length=20),
        ),
        migrations.RunSQL("UPDATE case_management_legalcase SET state = 'In Progress' WHERE state = 'InProgress';"),
    ]
