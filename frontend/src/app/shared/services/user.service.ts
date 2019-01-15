/*tslint:disable*/
import { Injectable } from '@angular/core';
// import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from '../../app.constant';
import * as _ from 'lodash';
import {catchError, tap} from 'rxjs/operators';
import {Http, Response} from '@angular/http';
import {throwError} from 'rxjs';


@Injectable()
export class UserService {
  private apiUrl: string = AppSettings.API_ENDPOINT;
  private loggedIn: boolean = false;
  private loggedInData: any = {};
  private isMobile:boolean = false;

  constructor(private http: Http){
    // localStorage.setItem('api_auth_token', '');
    this.loggedIn = !!localStorage.getItem('api_auth_token');
    if(this.loggedIn)
      try {
        this.loggedInData = JSON.parse(localStorage.getItem('api_user_data'));
      } catch(e) {
        alert(e); // error in the above string (in this case, yes)!
      }

  }
  getIsMobile(){
    return this.isMobile;
  }
  setIsMobile(f){
    this.isMobile = f;
  }
  /**
   * Log the user in
   */
  login(username: string, password: string): Observable<any> {
    let userData = {
      username : username,
      password : password
    }
    return this.http.post(`${this.apiUrl}/api/auth/login/`, userData)
      .pipe(
        tap(data => {
          console.log(data['_body'])
          let res =  JSON.parse(data['_body'])
          if (res['token'])
          {
            this.loggedIn = true;
            this.loggedInData = res['user'];
            localStorage.setItem('api_auth_token', res['token']);
            localStorage.setItem('api_user_data', JSON.stringify(res['user']));
          }
        }),
        catchError(this.handleError)
      )


    // .catch(this.handleError));
  }
  /**
   * Log the user in
   */
  register(userData:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/signup/`, userData)
      .pipe(
        tap(res => {
          console.log(res['._body'])

        }),
        catchError(this.handleError)
      )
    // );

  }
  sendMailFor(username:string):Observable<any>{
    let body = {username:username};
    return this.http.post(`${this.apiUrl}/api/auth/SendMailForPassword/`, body)
      .pipe(
        tap(data => {
          this.loggedIn = false;
          this.loggedInData = [];
          localStorage.setItem('api_auth_token', '');
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
  getLoggedInData() {
    return this.loggedInData;
  }

  changePasswordFor(username:string, userpass:string, token:string):Observable<any>{
    let body = {
      username:username,
      password:userpass,
      token:token,
    };
    return this.http.post(`${this.apiUrl}/api/auth/ChangePassword/`, body)
      .pipe(
        tap(data =>{
          this.loggedIn = false;
          this.loggedInData=[];
          localStorage.setItem('api_auth_token', '')
        }),
        catchError(this.handleError)
      )

  }




  /**
   * Log the user out
   */
  public logout() {
    localStorage.removeItem('api_auth_token');
    localStorage.removeItem('api_user_data');
    this.loggedInData = {};
    this.loggedIn = false;

  }
  /**
   * Request user active to backend
   */
  activeRequest(tk:string): Observable<any>{
    let tkData = {
      token : tk
    };
    return this.http.post(AppSettings.API_ENDPOINT+"/api/auth/Activate/", tkData)
      .pipe(
        tap(data => {
          let res = JSON.parse(data['_body'])
          if (res.token)
          {
            this.loggedIn = true;
            this.loggedInData = res.user;
            localStorage.setItem('api_auth_token', res.token);
            localStorage.setItem('api_user_data', JSON.stringify(res.user));
          }
        }),
        catchError(this.handleError)
      );

  }

  /**
   * Handle any errors from the API
   */
  private handleError(err) {
    let errMessage: string;

    if (err instanceof Response) {
      let body   = err.json() || '';
      let error  = body.error || JSON.stringify(body);
      errMessage = `${err.statusText || ''} : ${error}`;
    } else {
      errMessage = err.message ? err.message : err.toString();
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
  // 			`body was: ${error.error}`);
  // 	}
  // 	// return an ErrorObservable with a user-facing error message
  // 	return new ErrorObservable(
  // 		'Something bad happened; please try again later.');
  // };



}
