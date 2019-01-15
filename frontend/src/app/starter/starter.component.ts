import { Component, AfterViewInit } from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {ToastaConfig, ToastaService} from 'ngx-toasta';

@Component({
  templateUrl: './starter.component.html'
})
export class StarterComponent implements AfterViewInit {
  user = {first_name: '', last_name: '', username: '', password: '', }
  isLoading = false;
  active_status = false;
  constructor(
    private userService: UserService,
    private toastaService: ToastaService,
    private toastaConfig: ToastaConfig,
  ) {
    this.toastaConfig.theme = 'default';
  }
  get isLoggedIn() {
    return this.userService.isLoggedIn();
  }
  ngAfterViewInit() {}
  /**
   * SignUp a user
   */
  signUp() {
    this.isLoading = true;
    if (this.user.username.length < 1 ) {
      this.toastaService.info('Email is invalid.');
      return;
    }
    if (this.user.first_name.length < 1 ) {
      this.toastaService.info('First Name is invalid.');
      return;
    }
    if (this.user.last_name.length < 1 ) {
      this.toastaService.info('Last Name is invalid.');
      return;
    }
    if (this.user.password.length < 1 ) {
      this.toastaService.info('Password is invalid.');
      return;
    }
    const send_data = {
      username: this.user.username,
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      password: this.user.password
    };
    this.userService.register(send_data)
      .subscribe(
        (res: any) => {
          this.active_status = true;
          this.toastaService.success('Registered successfully');
          this.isLoading = false;

        },
        err => {
          this.isLoading = false;
          this.toastaService.error(err);
        }
      );

  }
}
