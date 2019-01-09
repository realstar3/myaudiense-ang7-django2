from django.conf.urls import url
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.decorators import api_view

urlpatterns = [
	path('auth/login/', views.UserLogin.as_view()),
	path('auth/signup/', views.UserSignUp.as_view()),
	path('auth/Logout/', views.UserLogout.as_view()),
	path('auth/Activate/', views.UserActivate.as_view()),
	path('auth/SendMailForPassword/', views.SendMailForResetPassword.as_view()),
	path('auth/ChangePassword/', views.ChangePassword.as_view()),

]
# urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

