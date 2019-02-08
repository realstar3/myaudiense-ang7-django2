import { Component, OnInit , Inject} from '@angular/core';
import {ChatService} from "../../shared/services/chat.service";

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  chats :any[] ;
  activeChat: any;
  client_image:string;
  client_name:string;
  chatName: string = 'demo';
  room_id;

  constructor(private chatService:ChatService) {
  }

  ngOnInit() {
    this.chatService.initWebScoketService();
    this.chatService.messages.subscribe(msg => {
      const msg_object = JSON.parse(msg['data']);

      if(this.room_id === msg_object['thread_id']){
        let read_m = {read:this.room_id}
        this.chatService.messages.next(read_m)
        this.activeChat.messages.push(msg_object)
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
      // this.activeChat = this.chats[0];
    });
  }

  sendChat(message) {

    this.chatService.messages.next({message});
  }

  onActiveChat(chat) {
    this.room_id = chat.hash_id;
    this.client_name = chat.client_name
    if(chat.image.length==0){
      this.client_image = "../../../assets/images/users/profile.png"
    } else {
      this.client_image = chat.image
    }


    this.chatService.load_message(this.room_id).subscribe(
      data=>{
        this.activeChat = data;
        this.chats.forEach(room=>{
          if (room.hash_id === this.room_id){
            room.unread_count = 0;
          }
        })
      });
  }

}
