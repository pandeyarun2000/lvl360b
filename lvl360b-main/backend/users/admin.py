from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(CustomUser)

from django.contrib import admin
from .models import Project

admin.site.register(Project)

