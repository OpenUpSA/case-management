# move_logs_from_case_update_to_legal_case added by rikusv

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_lifecycle.mixins


def fix_logs(apps, schema_editor):
    '''Move logs from case_update to legal_case and fix notes'''
    Log = apps.get_model('case_management', 'Log')
    CaseUpdate = apps.get_model('case_management', 'CaseUpdate')
    Meeting = apps.get_model('case_management', 'Meeting')
    for log in Log.objects.filter(parent_type='CaseUpdate'):
        case_update = CaseUpdate.objects.get(pk=log.parent_id)
        log.parent_type = 'LegalCase'
        log.parent_id = case_update.legal_case.id
        log.save()
    for log in Log.objects.filter(target_type='CaseUpdate'):
        case_update = CaseUpdate.objects.get(pk=log.target_id)
        log.note = f'{case_update.legal_case.case_number} case update'
        log.save()
    for log in Log.objects.filter(target_type='Meeting'):
        meeting = Meeting.objects.get(pk=log.target_id)
        value = meeting.name if meeting.name else meeting.meeting_type
        date = meeting.meeting_date.strftime('%d %B %Y')
        log.note = f'{value} on {date}'
        log.save()


class Migration(migrations.Migration):

    dependencies = [
        ('case_management', '0034_merge_20220409_1142'),
    ]

    operations = [
        migrations.RunPython(fix_logs, migrations.RunPython.noop),
    ]
