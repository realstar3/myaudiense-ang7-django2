import { Injectable } from '@angular/core';
import {Observable, Subject, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {WebSocketService} from "./websocket.service";
import {AppSettings} from "../../app.constant";
import {catchError, map} from "rxjs/operators";
import {send} from "q";
import {Router} from "@angular/router";

import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private wsService: WebSocketService,
              private httpClient: HttpClient,
              public router: Router) {}
  public messages: Subject<any>;
  private apiUrl: string = AppSettings.API_ENDPOINT;

  initWebScoketService() {
    const CHAT_URL = `ws://${this.apiUrl}/connect`;
    const key = localStorage.getItem('auth_token');
    const params = '?token=' + key
    this.messages = this.wsService.connect(CHAT_URL + params);
  }

  load_Inbox():Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.getToken()
      })
    };
    return this.httpClient.post(`http://${this.apiUrl}/messaging/load-inbox`,'', httpOptions)
  }

  load_message(thread_id):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.getToken()
      })
    }
    const body = {id:thread_id}
    return this.httpClient.post(`http://${this.apiUrl}/messaging/load-messages`,body, httpOptions)
  }

  getToken(){
    return localStorage.getItem('auth_token')
  }
  addRoom(send_data:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.getToken()
      })
    };
    const body = {title:send_data['room_title'], client_name:send_data['client_name']};
    return this.httpClient.post(`http://${this.apiUrl}/messaging/add-chatroom`, body,httpOptions)
      .pipe(
      catchError(this.handleError)

      )
  }

  private handleError(err) {
    let errMessage: string;
    try {
      if (err instanceof Response) {
        let body   = err.json() || '';
        // let error  = body.error || JSON.stringify(body);
        // errMessage = `${err.statusText || ''} : ${error}`;
      } else {

        errMessage = err.message ? err.message : err.toString();
        if(err['error']!=undefined){
          errMessage = err['statusText']
          let error = err['error']
          if(error['error'][0]!=undefined){
            errMessage = error['error'][0]
          }
        }
      }

    }
    catch (e) {
      errMessage = err['statusText']

    }

    return throwError(errMessage);
  }
  // private handleError(error: HttpErrorResponse) {
  // 	if (error.error instanceof ErrorEvent) {
  // 		// A client-side or network error occurred. Handle it accordingly.
  // 		console.error('An error occurred:', error.error.message);
  // 	} else {
  // 		// The backend returned an unsuccessful response code.
  // 		// The response body may contain clues as to what went wrong,
  // 		console.error(
  // 			`Backend returned code ${error.status}, ` +
  // 			`body was: ${error.error.details}`);
  // 		if(error['status']!=undefined && error['status']==403)
  //     {
  //       this.toastaService.error('Token not valid or not active user')
  //       this.userService.logout();
  //
  //     }
  // 	}
  // 	// return an ErrorObservable with a user-facing error message
  // 	return new ErrorObservable();
  // };
}
