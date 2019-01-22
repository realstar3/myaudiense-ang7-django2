/*tslint:disable*/
import { Injectable } from '@angular/core';
// import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from '../../app.constant';
import {catchError, tap} from 'rxjs/operators';
import {Http, Response} from '@angular/http';
import {throwError} from 'rxjs';
import {HttpErrorResponse} from "@angular/common/http";
import {ErrorObservable} from "rxjs-compat/observable/ErrorObservable";


@Injectable()
export class UserService {
  private apiUrl: string = AppSettings.API_ENDPOINT;
  private loggedIn: boolean = false;
  private loggedInData: any = {};
  private isMobile:boolean = false;

  constructor(private http: Http){

    this.loggedIn = !!localStorage.getItem('auth_token');
    if(this.loggedIn)
      try {
        this.loggedInData = JSON.parse(localStorage.getItem('my_profile'));
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
  login(email: string, password: string): Observable<any> {
    let userData = {
      email : email,
      password : password
    }
    return this.http.post(`${this.apiUrl}/api/auth/login/`, userData)
      .pipe(
        tap(data => {
          // console.log(data['_body'])
          let res =  JSON.parse(data['_body'])
          if (res['token'])
          {
            this.loggedIn = true;
            this.loggedInData = res['user'];
            localStorage.setItem('auth_token', res['token']);
            localStorage.setItem('my_profile', JSON.stringify(res['user']));
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
          // console.log(res['._body'])

        }),
        catchError(this.handleError)
      )
    // );

  }
  sendMailFor(email:string):Observable<any>{
    let body = {email:email};
    return this.http.post(`${this.apiUrl}/api/auth/SendMailForPassword/`, body)
      .pipe(
        tap(data => {
          this.loggedIn = false;
          this.loggedInData = [];
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
  getLoggedInData() {
    return this.loggedInData;
  }

  changePasswordFor(email:string, userpass:string, token:string):Observable<any>{
    let body = {
      email:email,
      password:userpass,
      token:token,
    };
    return this.http.post(`${this.apiUrl}/api/auth/ChangePassword/`, body)
      .pipe(
        tap(data =>{
          this.loggedIn = false;
          this.loggedInData=[];
          localStorage.setItem('auth_token', '')
        }),
        catchError(this.handleError)
      )

  }




  /**
   * Log the user out
   */
  public logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('my_profile');
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
            localStorage.setItem('auth_token', res.token);
            localStorage.setItem('my_profile', JSON.stringify(res.user));
          }
        }),
        catchError(this.handleError)
      );

  }
  userProfile(username):Observable<any>{
    let send_data = "username=" + username;
    return this.http.get(AppSettings.API_ENDPOINT+'/api/auth/Profile?' + send_data)
      .pipe(
        tap(data=>{
          let res = JSON.parse(data['_body'])
          localStorage.setItem('user_profile', JSON.stringify(res))
        }),
        catchError(this.handleError)
      )
  }


  /**
   * Handle any errors from the API
   */
  private handleError(err) {
    let errMessage: string;
    try {
      if (err instanceof Response) {
        let body   = err.json() || '';
        let error  = body.error || JSON.stringify(body);
        errMessage = `${err.statusText || ''} : ${error}`;
      } else {
        errMessage = err.message ? err.message : err.toString();
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
  // 			`body was: ${error.error}`);
  // 	}
  // 	// return an ErrorObservable with a user-facing error message
  // 	return new ErrorObservable('Something bad happened; please try again later.');
  // };



}
