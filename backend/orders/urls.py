from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ProductViewSet,
    OrderViewSet,
    UserViewSet,
    RegisterView,
    MeView,
)


router = DefaultRouter()


router.register(
    "products",
    ProductViewSet,
)


router.register(
    "orders",
    OrderViewSet,
    basename="orders",
)


router.register(
    "users",
    UserViewSet,
    basename="users",
)


urlpatterns = [

    path(
        "",
        include(router.urls),
    ),

    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    path(
        "me/",
        MeView.as_view(),
        name="me",
    ),

]
