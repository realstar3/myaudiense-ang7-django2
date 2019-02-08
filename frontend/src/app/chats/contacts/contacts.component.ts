import { Component, Input, Output, EventEmitter } from '@angular/core';
import {UserService} from "../../shared/services/user.service";
import {DomSanitizer} from "@angular/platform-browser";
import {MatDialog} from "@angular/material";
import {NoticeComponent} from "../notice/notice.component";
import {AddRoomDialog} from "../add-rooms/add-room.component";
import {ChatService} from "../../shared/services/chat.service";


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {

  @Input() chats;
  @Output() onActiveChat = new EventEmitter();
  imageToShow: any;
  isImageLoading=true;

  animal:any;
  constructor(private userService: UserService,
              private chatService: ChatService,
              private sanitizer : DomSanitizer,
              public dialog: MatDialog) {
  }
  ngAfterViewInit() {
    this.dispImage()
  }
  get GetProfile() {
    return this.userService.getMyProfile();
  }
  setActiveChat(chat) {
    this.onActiveChat.emit(chat);

  }

  dispImage() {
    let img_url = this.GetProfile.image;
    if(img_url==='') {
      this.isImageLoading = true;
      return;
    }
    this.isImageLoading = true;
    this.userService.getImage(img_url)
      .subscribe(
        data => {
          let urlCreator = window.URL;
          this.imageToShow = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(data));
          this.isImageLoading = false;
        },
        error => {
          this.isImageLoading = true;
          console.log(error);
        });

  }
  AddRoom(){
    const dialogRef = this.dialog.open(AddRoomDialog, {
      width: '300px',
      data: {room_title: "", client_name: ""}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result!=undefined)
        this.chatService.addRoom(result).subscribe()

    });

  }


}
