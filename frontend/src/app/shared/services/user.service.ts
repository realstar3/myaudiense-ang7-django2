/*tslint:disable*/
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from '../../app.constant';

@Injectable()
export class UserService {
  private apiUrl: string = AppSettings.API_ENDPOINT;
  private loggedIn: boolean = false;
  private loggedInData: any = {};

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
  sendMailFor(username:string):Observable<string>{
    let body = {username:username};
    return this.http.post(`${this.apiUrl}/api/auth/SendMailForPassword/`, body)
      .map(res => res.json())
      .do(res => {
        this.loggedIn = false;
        this.loggedInData = [];
        localStorage.setItem('api_auth_token', '');
      })
      .catch(this.handleError);
  }
  changePasswordFor(username:string, userpass:string):Observable<string>{
    let body = {
      username:username,
      password:userpass
    };
    return this.http.post(`${this.apiUrl}/api/auth/ChangePassword/`, body)
      .map(res => res.json())
      .do(res => {
        this.loggedIn = false;
        this.loggedInData=[];
        localStorage.setItem('api_auth_token', '')
      })
      .catch(this.handleError);
  }

  /**
   * Log the user in
   */
  login(username: string, password: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/api/auth/Login/`, { username, password })
      .map(res => res.json())
      .do(res => {
        if (res.token)
        {
          this.loggedIn = true;
          this.loggedInData = res.user;
          localStorage.setItem('api_auth_token', res.token);
            localStorage.setItem('api_user_data', JSON.stringify(res.user));
        }
      })
      .catch(this.handleError);
  }


    /**
   * Log the user in
   */
  register(username: string, password: string, last_name: string, first_name: string): Observable<string> {
    let userData = {
        username : username,
        email : username,
        password : password,
        first_name : first_name,
        last_name : last_name
    };
    return this.http.post(`${this.apiUrl}/api/auth/signup/`, userData)
      .map(res => res.json())
      .do(res => {
        if (res.token)
        {
          this.loggedIn = true;
          this.loggedInData = res.user;
            localStorage.setItem('api_auth_token', res.token);
            localStorage.setItem('api_user_data', JSON.stringify(res.user));
        }
      })
      .catch(this.handleError);
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
  activeRequest(tk:string): Observable<string>{
     let tkData = {
        token : tk
    };
    return this.http.post(AppSettings.API_ENDPOINT+"/api/auth/Activate/", tkData).map(res => res.json())
      .do(res => {
      if (res.token)
        {
          this.loggedIn = true;
          this.loggedInData = res.user;
            localStorage.setItem('api_auth_token', res.token);
            localStorage.setItem('api_user_data', JSON.stringify(res.user));
        }
      })
      .catch(this.handleError);
  }

  /**
   * Handle any errors from the API
   */
  private handleError(err) {
    let errMessage: string;

    if (err instanceof Response) {
      let body   = err.json() || '';
      let error  = body.error || JSON.stringify(body);
      errMessage = `${err.statusText || ''} ${error}`;
    } else {
      errMessage = err.message ? err.message : err.toString();
    }

    return Observable.throw(errMessage);
  }



}
