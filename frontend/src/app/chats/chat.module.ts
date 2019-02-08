import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChatRouterModule } from './chat.router';
import * as hljs from 'highlight.js';
import { HighlightJsModule, HIGHLIGHT_JS } from 'angular-highlight-js';
import * as hljsTypescript from 'highlight.js/lib/languages/typescript';
import { ChatComponent } from './chat/chat.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ContactsComponent } from './contacts/contacts.component';
import { NoticeComponent } from './notice/notice.component';

import {
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule
} from '@angular/material';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { environment } from '../../environments/environment';

import {ChatService} from "../shared/services/chat.service";
import {AddRoomDialog} from "./add-rooms/add-room.component";
import {ToastaModule} from "ngx-toasta";
export function highlightJsFactory(): any {
  hljs.registerLanguage('typescript', hljsTypescript);
  return hljs;
}

@NgModule({
    imports: [
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HighlightJsModule.forRoot({
        provide: HIGHLIGHT_JS,
        useFactory: highlightJsFactory
    }),
    ChatRouterModule,
    ToastaModule.forRoot(),
    ],
    declarations: [
        ChatComponent,
        ChatListComponent,
        ContactsComponent,
        NoticeComponent,
        AddRoomDialog,

    ],
    exports: [
    ],
    entryComponents: [
        NoticeComponent, AddRoomDialog
    ],
    providers: [
    {provide: 'ChatsService', useClass: ChatService},
  ]

})
export class ChatsModule { }


