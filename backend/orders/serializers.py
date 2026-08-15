from rest_framework import serializers

from .models import Product, Order


class ProductSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = Product

        fields = [
            "id",
            "name",
            "price",
            "stock",
            "created_at",
        ]


class OrderSerializer(
    serializers.ModelSerializer
):

    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    class Meta:
        model = Order

        fields = [
            "id",
            "user",
            "username",
            "customer_name",
            "product",
            "product_name",
            "quantity",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "user",
            "username",
            "product_name",
            "created_at",
        ]
