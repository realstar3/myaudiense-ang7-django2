from django.contrib import admin

# Register your models here.
# -*- coding: utf-8 -*-


from django.contrib import admin
from .models import AuthToken, Review, Friend, Profile
# Register your models here.


class AuthTokenAdmin(admin.ModelAdmin):
	list_display = [
		field.name for field in AuthToken._meta.fields]


admin.site.register(AuthToken, AuthTokenAdmin)


class ReviewAdmin(admin.ModelAdmin):
	list_display = [
		field.name for field in Review._meta.fields]


admin.site.register(Review, ReviewAdmin)


class FriendAdmin(admin.ModelAdmin):
	list_display = [
		field.name for field in Friend._meta.fields]


admin.site.register(Friend, FriendAdmin)


class ProfileAdmin(admin.ModelAdmin):
	list_display = [
		field.name for field in Profile._meta.fields]


admin.site.register(Profile, ProfileAdmin)

