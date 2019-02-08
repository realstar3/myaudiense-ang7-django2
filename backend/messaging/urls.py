# messaging/urls.py
 
from django.conf.urls import url
from django.urls import path
                     
from . import views
                     
                     
urlpatterns = [
    path('load-inbox',views.LoadInbox.as_view()),
    # path('load-inbox',views.load_inbox),
    path('load-messages',views.LoadMessages.as_view()),
    # path('load-messages',views.load_messages),
    path('add-chatroom',views.AddChatRoom.as_view()),
    # path('add-chatroom',views.add_chatroom),
]