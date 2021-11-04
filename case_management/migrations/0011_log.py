# Generated by Django 3.2.4 on 2021-10-11 12:48

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('case_management', '0010_legalcase_summary'),
    ]

    operations = [
        migrations.CreateModel(
            name='Log',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('parent_id', models.IntegerField()),
                ('target_id', models.IntegerField()),
                ('target_type', models.CharField(max_length=255)),
                ('action', models.CharField(max_length=255)),
                ('note', models.CharField(blank=True, max_length=500, null=True)),
                (
                    'user',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='logs',
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
