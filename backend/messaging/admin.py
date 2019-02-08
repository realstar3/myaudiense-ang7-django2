from django.contrib import admin

# Register your models here.
from .models import MessageThread, Message, UnreadReceipt


class MessageThreadAdmin(admin.ModelAdmin):
	list_display = [
		field.name for field in MessageThread._meta.fields]


admin.site.register(MessageThread, MessageThreadAdmin)


class MessageAdmin(admin.ModelAdmin):
	list_display = [
		field.name for field in Message._meta.fields]


admin.site.register(Message, MessageAdmin)


class UnreadReceiptAdmin(admin.ModelAdmin):
	list_display = [
		field.name for field in UnreadReceipt._meta.fields]


admin.site.register(UnreadReceipt, UnreadReceiptAdmin)