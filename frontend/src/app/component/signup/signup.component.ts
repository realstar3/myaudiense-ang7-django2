import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '../../_helpers/must-match.validator';
import {UserService} from '../../shared/services/user.service';
import {Router} from '@angular/router';
import {ToastaService} from 'ngx-toasta';

import {ExistSpace} from "../../_helpers/exist-space.validator";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  // credentials = { username: '', password: '' };
  recapcha_flag = true;
  isLoading = false;
  registerForm: FormGroup;
  submitted = false;
  active_status = false;
  constructor(
    private userService: UserService,
    private router: Router,
    private toastaService: ToastaService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    // console.log('<<<< user-signin comp started >>>')
    this.recapcha_flag = false;
    this.userService.logout();
    localStorage.setItem('source_path', '/');
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: [MustMatch('password', 'confirmPassword'),
      ExistSpace('userName')]
    });

  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    const send_data = {
      email: this.registerForm.value['email'],
      username: this.registerForm.value['userName'],
      first_name: this.registerForm.value['firstName'],
      last_name: this.registerForm.value['lastName'],
      password: this.registerForm.value['password']
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
  /**
   * Robot checking via reCapcha
   */
  handleCorrectCaptcha($event) {
    this.recapcha_flag = event.isTrusted;
  }

}
