# Generated by Django 5.0.6 on 2024-07-10 03:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_remove_project_attached_documents'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='attached_documents',
            field=models.FileField(blank=True, null=True, upload_to='documents/'),
        ),
        migrations.DeleteModel(
            name='ProjectDocument',
        ),
    ]
