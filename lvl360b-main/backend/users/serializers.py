from rest_framework import serializers # type: ignore
from django.contrib.auth import get_user_model
from .models import Project

CustomUser = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop('password', None)
        return ret

class RegisterSerializer(serializers.ModelSerializer):
    class Meta: 
        model = CustomUser
        fields = ('id', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = { 'password': {'write_only':True}}
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'status', 'description', 'start_date', 'end_date',
            'requirements', 'geographies', 'service_scope', 'attached_documents', 'owner'
        ]
        read_only_fields = ['owner']

class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(max_length=None, use_url=True, required=False)
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'profile_picture']

    def get_profile_picture(self, obj):
        request = self.context.get('request')
        if obj.profile_picture and hasattr(obj.profile_picture, 'url'):
            return request.build_absolute_uri(obj.profile_picture.url)
        return None
    
from .models import ProjectLog

class ProjectLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectLog
        fields = ['timestamp', 'user', 'action']