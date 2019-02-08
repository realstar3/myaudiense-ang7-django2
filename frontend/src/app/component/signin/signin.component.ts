/*tslint:disable*/
import {Component, Input, OnInit} from '@angular/core';
import { Router} from '@angular/router';
import {UserService} from '../../shared/services/user.service';
import {ToastaService} from 'ngx-toasta';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MustMatch} from '../../_helpers/must-match.validator';
@Component({
  templateUrl: './signin.component.html',
  styleUrls : ['./signin.component.scss']
})
export class UserSignInComponent implements OnInit {
  credentials = { username: '', password: '' };
  recapcha_flag = true;
  isLoading = false;
  registerForm: FormGroup;
  submitted = false;
  constructor(
    private userService: UserService,
    private router: Router,
    private toastaService: ToastaService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // console.log('<<<< user-signin comp started >>>')
    this.recapcha_flag = false;
    this.userService.logout();
    localStorage.setItem("source_path",'/');
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

    },
    );

  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.userService.login(this.registerForm.value['email'], this.registerForm.value['password'])
      .subscribe(
        data => {
          this.isLoading = false;
          this.toastaService.success('Success');
          this.router.navigate(['/starter']);
          this.userService.emitChange('Data from child');
        },
        errMessage => {
          this.isLoading = false;
          // if (err.indexOf("Unauthorized") != -1)
          this.toastaService.error(errMessage);
        }

      )


  }
  /**
   * Robot checking via reCapcha
   */
  handleCorrectCaptcha($event) {
    this.recapcha_flag = event.isTrusted;
  }
}
