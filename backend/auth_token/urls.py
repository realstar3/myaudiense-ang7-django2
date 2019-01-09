from django.conf.urls import url
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.decorators import api_view

urlpatterns = [
	url(r'^/auth/Login/', views.UserLogin.as_view()),
	url(r'^/auth/SignUp/', views.UserSignUp.as_view()),
	url(r'^auth/Logout/', views.UserLogout.as_view()),
    # url('api/Activate/', api.UserActivate.as_view()),
    # url('api/SendMailForPassword/', api.SendMailForResetPassword.as_view()),
    # url('api/ChangePassword/', api.ChangePassword.as_view()),

]
# urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

