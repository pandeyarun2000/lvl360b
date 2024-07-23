from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter # type: ignore
from django.conf import settings
from django.conf.urls.static import static


from .views import UserViewset, LoginViewset, RegisterViewset, ProjectViewSet, AllUsersViewSet
from .views import ProjectLogListView

router = DefaultRouter()
router.register('register', RegisterViewset, basename='register')
router.register('login', LoginViewset, basename='login')
router.register(r'users', UserViewset, basename='user')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'all-users', AllUsersViewSet, basename='all-users')  # New endpoint for all users

urlpatterns = [
    
    path('', include(router.urls)),  # Include router's URLs in urlpatterns
    path('projects/<int:project_id>/logs/', ProjectLogListView.as_view(), name='project-logs'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)