"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
	path('admin/', admin.site.urls),
	path('api/', include('auth_token.urls')),
	path('messaging/', include('messaging.urls')),

	# url('api/auth/login/$', views.UserLogin.as_view()),
	# url('api/auth/signup/$', views.UserSignUp.as_view()),
	# url('api/auth/Logout/', views.UserLogout.as_view()),
	# url('api/auth/Activate/', views.UserActivate.as_view()),
	# url('api/auth/SendMailForPassword/', views.SendMailForResetPassword.as_view()),
	# url('api/auth/ChangePassword/', views.ChangePassword.as_view()),

]

