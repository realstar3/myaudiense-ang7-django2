import {Component, Input, Inject, Output, EventEmitter, ViewChild, SimpleChanges} from '@angular/core';
import { MatDialog } from '@angular/material';
import { NoticeComponent } from '../notice/notice.component';
import { PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

  @Input() chatSidenav;
  @Input() activeChat;
  @Input() room;
  @Input() messages;
  @Output() onSendChat = new EventEmitter();

  @Input() MsgLoadedEvents: Observable<void>;
  private eventsSubscription: any;
  private eventsSubject: Subject<void> = new Subject<void>();

  public config: PerfectScrollbarConfigInterface = {};
  newMessage: string;
  avatar: string ;

  constructor(public dialog: MatDialog) {
    if(JSON.parse(localStorage.getItem('my_profile')).image.length==0){
      this.avatar = "../../../assets/images/users/profile.png"
    }else
    {

      this.avatar = JSON.parse(localStorage.getItem('my_profile')).image
    }
  }
  ngAfterViewInit() {

    this.eventsSubscription = this.MsgLoadedEvents.subscribe(() => {
        this.scrollToBottom()
    })

  }
  onSendTriggered() {
    if (this.newMessage) {
      let message = {
        hash_id:this.activeChat.hash_id,
        text:this.newMessage
      };

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
  public type: string = 'component';
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  public scrollToBottom(): void {
    if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToBottom(-100, 0.3);
    }
  }
  public onScrollEvent(event: any): void {
    // console.log(event);
  }

}
