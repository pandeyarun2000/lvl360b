# Generated by Django 5.0.6 on 2024-07-09 23:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_project_attached_documents_project_geography_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='project',
            old_name='geography',
            new_name='geographies',
        ),
    ]