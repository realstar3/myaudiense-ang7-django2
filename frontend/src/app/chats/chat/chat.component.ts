import { Component, Input, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NoticeComponent } from '../notice/notice.component';
import {ChatService} from "../../shared/services/chat.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

  @Input() chatSidenav;
  @Input() activeChat;
  @Input() client_image;
  @Input() client_name;
  @Input() messages;
  @Output() onSendChat = new EventEmitter();

  newMessage: string;
  avatar: string ;

  animal: string;
  name: string;

  constructor(private chatService:ChatService, public dialog: MatDialog) {
    if(JSON.parse(localStorage.getItem('my_profile')).image.length==0){
      this.avatar = "../../../assets/images/users/profile.png"
    }else
    {

      this.avatar = JSON.parse(localStorage.getItem('my_profile')).image
    }
  }

  onSendTriggered() {
    if (this.newMessage) {
        let message = {
          hash_id:this.activeChat.hash_id,
          text:this.newMessage
        };
      // let chat = {
      //   message: this.newMessage,
      //   when: new Date(),
      //   who: 'me'
      // };
      // this.activeChat.messages.push(chat);
      this.onSendChat.emit(message);
      this.newMessage = '';
    }

  }

  clearMessages(activeChat) {
    activeChat.messages.length = 0;
  }

  onChatSideTriggered() {
    this.chatSidenav.toggle();
  }

  // onNoticeTriggered() {
  //   const dialogRef = this.dialog.open(NoticeComponent, {
  //     width: '250px',
  //     data: {name: this.name, animal: this.animal}
  //   });
  //
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     this.animal = result;
  //
  //   });
  // }

}
