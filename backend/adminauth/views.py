from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


ADMIN_USERNAME = 'Ali'
ADMIN_PASSWORD = 'Ali@78612'


def build_admin_user(request):
    # No DB admin user required; create a lightweight proxy user.
    # We still use django's User model for compatibility with DRF authentication.
    # If user doesn't exist, create one.
    user, _ = User.objects.get_or_create(username=ADMIN_USERNAME, defaults={'email': 'admin@example.com'})
    user.is_active = True
    user.is_staff = True
    user.is_superuser = False
    user.is_admin = True  # dynamic attribute
    return user


class AdminLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        name = request.data.get('name') or request.data.get('username')
        password = request.data.get('password')

        if name != ADMIN_USERNAME or password != ADMIN_PASSWORD:
            return Response({'detail': 'Invalid admin credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        admin_user = build_admin_user(request)
        refresh = RefreshToken.for_user(admin_user)
        return Response(
            {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': admin_user.id,
                    'username': admin_user.username,
                    'email': admin_user.email,
                    'is_admin': True,
                },
            },
            status=status.HTTP_200_OK,
        )

