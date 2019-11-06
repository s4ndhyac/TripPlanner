# Generated by Django 2.2.6 on 2019-11-06 00:20

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('member_service', '0002_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='Itinerary',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('plan', django.contrib.postgres.fields.jsonb.JSONField()),
                ('group', models.ForeignKey(db_column='group_id', on_delete=django.db.models.deletion.CASCADE, to='member_service.Group')),
            ],
        ),
    ]