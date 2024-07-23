from django.shortcuts import get_object_or_404
from rest_framework.decorators import action # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import viewsets, permissions # type: ignore
from .serializers import RegisterSerializer, LoginSerializer, ProjectSerializer, UserSerializer
from .models import Project
from django.contrib.auth import get_user_model, authenticate
from knox.models import AuthToken # type: ignore
from rest_framework.parsers import MultiPartParser, FormParser # type: ignore

CustomUser = get_user_model()

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # Add parser classes for file uploads


    def perform_create(self, serializer):
        attached_documents = self.request.data.get('attached_documents')
        serializer.save(owner=self.request.user, attached_documents=attached_documents)

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        return queryset

    @action(detail=True, methods=['get'])
    def details(self, request, pk=None):
        project = get_object_or_404(Project, pk=pk)
        serializer = self.get_serializer(project)
        return Response(serializer.data)

class LoginViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def create(self, request): 
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(): 
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, email=email, password=password)
            if user: 
                _, token = AuthToken.objects.create(user)
                return Response(
                    {
                        "user": {
                            "id": user.id,
                            "username": user.username,
                            "email": user.email,
                            "first_name": user.first_name,
                            "in_progress_projects_count": user.projects.filter(status='in_progress').count()
                        },
                        "token": token
                    }
                )
            else: 
                return Response({"error":"Invalid credentials"}, status=401)    
        else: 
            return Response(serializer.errors, status=400)

class RegisterViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else: 
            return Response(serializer.errors, status=400)

class UserViewset(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def list(self, request):
        user = request.user
        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "phone": user.phone,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "in_progress_projects_count": user.projects.filter(status='in_progress').count()
        }
        return Response(user_data)
    
    def update(self, request, pk=None):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
class AllUsersViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def list(self, request):
        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
from rest_framework import generics # type: ignore
from .models import ProjectLog
from .serializers import ProjectLogSerializer

class ProjectLogListView(generics.ListAPIView):
    serializer_class = ProjectLogSerializer

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        return ProjectLog.objects.filter(project_id=project_id).order_by('-timestamp')