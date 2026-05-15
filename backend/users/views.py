from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                'id': serializer.data['id'],
                'username': serializer.data['username'],
                'email': serializer.data['email'],
                'message': 'User registered successfully',
            },
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

        users = User.objects.filter(email=request.data.get('email')).order_by('id')
        user = users.first() if users.exists() else None
        if not user:
            return Response({'detail': 'Account not found. Please register.'}, status=status.HTTP_401_UNAUTHORIZED)
        if users.count() > 1:
            return Response(
                {'detail': 'Multiple accounts use this email. Please contact support or login with your username.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(
            {
                'access': serializer.validated_data['access'],
                'refresh': serializer.validated_data['refresh'],
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                },
            },
            status=status.HTTP_200_OK,
        )

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
