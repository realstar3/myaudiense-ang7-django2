import {Component, OnInit, Inject, Input} from '@angular/core';
import {ChatService} from "../../shared/services/chat.service";
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  private MsgLoadedEvents_Subject: Subject<void> = new Subject<void>();
  chats :any[] ;
  activeChat: any;
  room = {
    'room_id':'',
    'title':'',
    'client_name':'',
    'client_image':''

  };


  constructor(private chatService:ChatService) {
  }

  ngOnInit() {
    this.chatService.initWebScoketService();
    this.chatService.messages.subscribe(msg => {
      const msg_object = JSON.parse(msg['data']);

      if(this.room.room_id === msg_object['thread_id']){
        let read_m = {read:this.room.room_id}
        this.chatService.messages.next(read_m)
        this.activeChat.messages.push(msg_object)
        this.MsgLoadedEvents_Subject.next();
      }else{
        this.chats.forEach(room=>{
          if (room.hash_id === msg_object['thread_id']){
            room.unread_count +=1;
          }
        })
      }
    });
    // this.createChat();
    this.getChatsList();
  }

  getChatsList() {
    this.chatService.load_Inbox().subscribe(chats => {
      this.chats = JSON.parse(chats['threads']);
      if (this.chats.length!=undefined)
        this.onActiveChat(this.chats[0]);
    });
  }

  sendChat(message) {

    this.chatService.messages.next({message});
  }

  onActiveChat(chat) {
    this.room['room_id'] = chat.hash_id;
    this.room['client_name'] = chat.client_name
    this.room['title'] = chat.title
    if(chat.image.length==0){
      this.room.client_image = "../../../assets/images/users/profile.png"
    } else {
      this.room.client_image = chat.image
    }


    this.chatService.load_message(this.room.room_id).subscribe(
      data=>{
        this.activeChat = data;
        this.chats.forEach(room=>{
          if (room.hash_id === this.room.room_id){
            room.unread_count = 0;
          }
        });
        this.MsgLoadedEvents_Subject.next();
      });
  }

}
