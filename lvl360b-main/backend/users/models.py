from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django_rest_passwordreset.signals import reset_password_token_created # type: ignore
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags

class CustomUserManager(BaseUserManager): 
    def create_user(self, email, password=None, **extra_fields): 
        if not email: 
            raise ValueError('Email is a required field')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields): 
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    email = models.EmailField(max_length=200, unique=True)
    phone = models.CharField(max_length=20, unique=True, help_text='Enter phone number', null=True, blank=True)
    birthday = models.DateField(null=True, blank=True)
    username = models.CharField(max_length=200, null=True, blank=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)  # Ensure this line is included
    objects = CustomUserManager()
    profile_picture = models.ImageField(upload_to='profile_picture/', blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

@receiver(reset_password_token_created)
def password_reset_token_created(reset_password_token, *args, **kwargs):
    sitelink = "http://localhost:5173/"
    token = "{}".format(reset_password_token.key)
    full_link = str(sitelink)+str("password-reset/")+str(token)

    print(token)
    print(full_link)

    context = {
        'full_link': full_link,
        'email_adress': reset_password_token.user.email
    }

    html_message = render_to_string("backend/email.html", context=context)
    plain_message = strip_tags(html_message)

    msg = EmailMultiAlternatives(
        subject = "Request for resetting password for {title}".format(title=reset_password_token.user.email), 
        body=plain_message,
        from_email = "sender@example.com", 
        to=[reset_password_token.user.email]
    )

    msg.attach_alternative(html_message, "text/html")
    msg.send()

class Project(models.Model):
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=20)
    description = models.TextField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    requirements = models.TextField(null=True, blank=True)
    geographies = models.CharField(max_length=100, null=True, blank=True)
    service_scope = models.TextField(null=True, blank=True)
    attached_documents = models.FileField(upload_to='documents/', null=True, blank=True)
    owner = models.ForeignKey(CustomUser, related_name='projects', on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    
from django.contrib.auth.models import User
from django.conf import settings

class ProjectLog(models.Model):
    project = models.ForeignKey('Project', related_name='logs', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    action = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.timestamp} - {self.user.username} - {self.action}"