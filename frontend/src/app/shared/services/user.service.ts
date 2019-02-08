/*tslint:disable*/
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from '../../app.constant';
import {catchError, tap, map} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {ErrorObservable} from "rxjs-compat/observable/ErrorObservable";
import {ToastaService} from "ngx-toasta";



@Injectable()
export class UserService {
  private apiUrl: string = AppSettings.API_ENDPOINT;
  private loggedIn: boolean = false;
  private user_profile: any = {};
  private my_profile: any = {};
  private isMobile:boolean = false;
  private user_reviews:any = {};
  private user_friends:any = {};

  private emitChangeSource = new Subject<any>();
  // Observable string streams
  changeEmitted$ = this.emitChangeSource.asObservable();
  // Service message commands
  emitChange(message: string) {
    this.emitChangeSource.next(message);
  }


  constructor(private  httpClient:HttpClient,
              private toastaService:ToastaService){

    this.loggedIn = !!localStorage.getItem('auth_token');
    if(this.loggedIn)
      try {
        this.my_profile = JSON.parse(localStorage.getItem('my_profile'));
      } catch(e) {
        alert(e); // error in the above string (in this case, yes)!
      }

  }

  /**
   * Log the user in
   */
  login(email: string, password: string): Observable<any> {
    let userData = {
      email : email,
      password : password
    }
    return this.httpClient.post(`http://${this.apiUrl}/api/auth/login/`, userData)
      .pipe(
        tap(res => {

          if (res['token'])
          {
            this.loggedIn = true;
            this.my_profile = res['user'];
            localStorage.setItem('auth_token', res['token']);
            localStorage.setItem('my_profile', JSON.stringify(res['user']));
          }
          this.emitChangeSource.next("logged")
        }),
        catchError(this.handleError)
      )


    // .catch(this.handleError));
  }
  /**
   * Log the user in
   */
  register(userData:any): Observable<any> {
    return this.httpClient.post(`http://${this.apiUrl}/api/auth/signup/`, userData)
      .pipe(
        tap(res => {


        }),
        catchError(this.handleError)
      )
    // );

  }
  sendMailFor(email:string):Observable<any>{
    let body = {email:email};
    return this.httpClient.post(`http://${this.apiUrl}/api/auth/SendMailForPassword/`, body)
      .pipe(
        tap(data => {
          this.loggedIn = false;
          this.my_profile = [];
          localStorage.setItem('auth_token', '');
        }),
        catchError(this.handleError)
      )

  }

  /**
   * Check if the user is logged in
   */
  isLoggedIn() {
    return this.loggedIn;
  }


  /**
   * Check if the user is logged in
   */
  getMyProfile() {
    return this.my_profile;
  }
  getUserProfile(){
    return this.user_profile;
  }

  getReviews(){
    return this.user_reviews;
  }

  getFriends(){
    return this.user_friends;
  }
  getToken(){
    return localStorage.getItem('auth_token')
  }

  changePasswordFor(email:string, userpass:string, token:string):Observable<any>{
    let body = {
      email:email,
      password:userpass,
      token:token,
    };
    return this.httpClient.post(`http://${this.apiUrl}/api/auth/ChangePassword/`, body)
      .pipe(
        tap(data =>{
          this.loggedIn = false;
          this.my_profile=[];
          localStorage.setItem('auth_token', '')
        }),
        catchError(this.handleError)
      )

  }




  /**
   * Log the user out
   */
  public logout() {
    // localStorage.removeItem('auth_token');
    // localStorage.removeItem('my_profile');
    localStorage.clear()
    this.my_profile = {};
    this.loggedIn = false;

  }
  /**
   * Request user active to backend
   */
  activeRequest(tk:string): Observable<any>{
    let tkData = {
      token : tk
    };
    return this.httpClient.post("http://"+AppSettings.API_ENDPOINT+"/api/auth/Activate/", tkData)
      .pipe(
        tap(res => {

          if (res['token']!=undefined)
          {
            this.loggedIn = true;
            this.my_profile = res['user'];
            localStorage.setItem('auth_token', res['token']);
            localStorage.setItem('my_profile', JSON.stringify(res['user']));
          }
        }),
        catchError(this.handleError)
      );

  }
  userProfile(username):Observable<any>{
    let send_data = "username=" + username;
    return this.httpClient.get("http://" + AppSettings.API_ENDPOINT+'/api/auth/Profile?' + send_data)
      .pipe(
        tap(res=>{

          if(res['profile']!==undefined){
            let profile = JSON.parse(res['profile']);
            if(profile.username===this.my_profile.username){
              this.my_profile = profile
              localStorage.setItem('my_profile', res['profile']);
            }
            else {
              this.user_profile = profile
              localStorage.setItem('user_profile', res['profile']);
            }
          }
          if(res['reviews']!==undefined){
            this.user_reviews = JSON.parse(res['reviews']);
            localStorage.setItem('reviews', res['reviews']);
          }else {
            this.user_reviews = [];
            localStorage.setItem('reviews', '');
          }
          if(res['friends']!==undefined){
            this.user_friends = JSON.parse(res['friends']);
            localStorage.setItem('friends', res['friends']);
          }else {
            this.user_friends = [];
            localStorage.setItem('friends', '');
          }


        }),
        catchError(this.handleError)
      )
  }

  getImage(imageUrl: string): Observable<any> {
    return this.httpClient
      .get(imageUrl, { responseType: 'blob' })
      .pipe(
        tap( res=>{

        }),

        catchError(this.handleError)
      )

  }
  leaveReview(send_data:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.getToken()
      })
    };
    return this.httpClient
      .post(`http://${this.apiUrl}/api/auth/SaveReview/`, send_data, httpOptions)
      .pipe(
        tap( res=> {

        }),
        catchError(this.handleError)
      );
  }

  RequestFriend(friend_user_name):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.getToken()
      })
    };
    return this.httpClient
    .post(`http://${this.apiUrl}/api/auth/RequestFriend/`, {friend_user_name}, httpOptions)
      .pipe(
        tap( res=> {

        }),
        catchError(this.handleError)
      );
  }

  /**
   * Handle any errors from the API
   */
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
  // 			`body was: ${error.error.detail}`);
  // 		if(error['status']!=undefined && error['status']==403)
  //     {
  //       this.toastaService.error('Token not valid or not active user');
  //       this.logout();
  //
  //     }
  // 	}
  // 	// return an ErrorObservable with a user-facing error message
  // 	return new ErrorObservable();
  // };



}
