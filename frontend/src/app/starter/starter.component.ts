import { Component, AfterViewInit } from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {ToastaConfig, ToastaService} from 'ngx-toasta';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MustMatch} from "../_helpers/must-match.validator";
import {ExistSpace} from "../_helpers/exist-space.validator";


@Component({
  templateUrl: './starter.component.html'
})
export class StarterComponent implements AfterViewInit {
  // user = {first_name: '', last_name: '', username: '', password: '', }
  isLoading = false;
  registerForm: FormGroup;
  submitted = false;
  active_status = false;
  constructor(
    private userService: UserService,
    private toastaService: ToastaService,
    private toastaConfig: ToastaConfig,
    private formBuilder: FormBuilder
  ) {
    this.toastaConfig.theme = 'default';
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    },{
      validator: [ExistSpace('userName')]
      }
      );
  }

  get f() { return this.registerForm.controls; }

  get isLoggedIn() {
    return this.userService.isLoggedIn();
  }
  ngAfterViewInit() {}
  /**
   * SignUp a user
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    const send_data = {
      username: this.registerForm.value['userName'],
      email: this.registerForm.value['email'],
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
}
