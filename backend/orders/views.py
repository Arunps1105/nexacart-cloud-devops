from django.contrib.auth.models import User
from django.db import transaction

from rest_framework import status, viewsets
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAdminUser,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product, Order
from .serializers import (
    ProductSerializer,
    OrderSerializer,
)


class AdminOrReadOnly(IsAuthenticated):
    """
    Authenticated users can read.

    Only administrators can:
    - create
    - update
    - delete
    """

    def has_permission(
        self,
        request,
        view
    ):
        if (
            not request.user
            or not request.user.is_authenticated
        ):
            return False

        if request.method in [
            "GET",
            "HEAD",
            "OPTIONS",
        ]:
            return True

        return request.user.is_staff


class ProductViewSet(
    viewsets.ModelViewSet
):

    queryset = Product.objects.all()

    serializer_class = ProductSerializer

    permission_classes = [
        AdminOrReadOnly
    ]


class OrderViewSet(
    viewsets.ModelViewSet
):

    serializer_class = OrderSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        if self.request.user.is_staff:
            return Order.objects.select_related(
                "user",
                "product"
            ).all()

        return Order.objects.select_related(
            "user",
            "product"
        ).filter(
            user=self.request.user
        )

    @transaction.atomic
    def create(
        self,
        request,
        *args,
        **kwargs
    ):

        product_id = request.data.get(
            "product"
        )

        try:
            quantity = int(
                request.data.get(
                    "quantity",
                    0
                )
            )

        except (
            TypeError,
            ValueError
        ):
            quantity = 0

        if quantity <= 0:
            return Response(
                {
                    "error":
                    "Quantity must be greater than 0."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            product = (
                Product.objects
                .select_for_update()
                .get(
                    id=product_id
                )
            )

        except Product.DoesNotExist:

            return Response(
                {
                    "error":
                    "Product not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if product.stock < quantity:

            return Response(
                {
                    "error":
                    "Insufficient stock.",
                    "available_stock":
                    product.stock,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        customer_name = request.data.get(
            "customer_name"
        )

        if not customer_name:

            customer_name = (
                request.user.get_full_name()
                or request.user.username
            )

        order = Order.objects.create(
            user=request.user,
            customer_name=customer_name,
            product=product,
            quantity=quantity,
            status="PENDING",
        )

        product.stock -= quantity

        product.save(
            update_fields=["stock"]
        )

        serializer = self.get_serializer(
            order
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    def update(
        self,
        request,
        *args,
        **kwargs
    ):

        if not request.user.is_staff:

            return Response(
                {
                    "error":
                    "Only administrators can update orders."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().update(
            request,
            *args,
            **kwargs
        )

    def partial_update(
        self,
        request,
        *args,
        **kwargs
    ):

        if not request.user.is_staff:

            return Response(
                {
                    "error":
                    "Only administrators can update orders."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().partial_update(
            request,
            *args,
            **kwargs
        )

    def destroy(
        self,
        request,
        *args,
        **kwargs
    ):

        if not request.user.is_staff:

            return Response(
                {
                    "error":
                    "Only administrators can delete orders."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().destroy(
            request,
            *args,
            **kwargs
        )


class UserViewSet(
    viewsets.ReadOnlyModelViewSet
):

    queryset = User.objects.all().order_by(
        "-date_joined"
    )

    permission_classes = [
        IsAdminUser
    ]

    def list(
        self,
        request,
        *args,
        **kwargs
    ):

        users = []

        for user in self.get_queryset():

            users.append(
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name":
                        user.first_name,
                    "last_name":
                        user.last_name,
                    "is_staff":
                        user.is_staff,
                    "is_superuser":
                        user.is_superuser,
                    "is_active":
                        user.is_active,
                    "date_joined":
                        user.date_joined,
                }
            )

        return Response(users)


class RegisterView(APIView):

    permission_classes = [
        AllowAny
    ]

    def post(
        self,
        request
    ):

        username = request.data.get(
            "username",
            ""
        ).strip()

        password = request.data.get(
            "password",
            ""
        )

        email = request.data.get(
            "email",
            ""
        ).strip()

        first_name = request.data.get(
            "first_name",
            ""
        ).strip()

        last_name = request.data.get(
            "last_name",
            ""
        ).strip()

        if not username:

            return Response(
                {
                    "error":
                    "Username is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not password:

            return Response(
                {
                    "error":
                    "Password is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(password) < 6:

            return Response(
                {
                    "error":
                    "Password must be at least 6 characters."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(
            username=username
        ).exists():

            return Response(
                {
                    "error":
                    "Username already exists."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if email and User.objects.filter(
            email=email
        ).exists():

            return Response(
                {
                    "error":
                    "Email already exists."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            first_name=first_name,
            last_name=last_name,
        )

        return Response(
            {
                "message":
                    "User registered successfully.",

                "user":
                    {
                        "id": user.id,
                        "username":
                            user.username,
                        "email":
                            user.email,
                        "first_name":
                            user.first_name,
                        "last_name":
                            user.last_name,
                        "is_staff":
                            user.is_staff,
                    }
            },
            status=status.HTTP_201_CREATED,
        )


class MeView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request
    ):

        user = request.user

        return Response(
            {
                "id": user.id,
                "username":
                    user.username,
                "email":
                    user.email,
                "first_name":
                    user.first_name,
                "last_name":
                    user.last_name,
                "is_staff":
                    user.is_staff,
                "is_superuser":
                    user.is_superuser,
                "is_active":
                    user.is_active,
            }
        )
