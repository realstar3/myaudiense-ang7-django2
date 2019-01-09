
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {homeRouting} from './home.routing';
import {FormControl, FormGroup, FormsModule, Validators} from '@angular/forms';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';
import {CommonModule} from '@angular/common';
import {ReCaptchaModule} from 'angular2-recaptcha';
import {HomeComponent} from './home.component';
import {UserSignUpComponent} from '../user-signup/user-signup.component';
import {UserSignInComponent} from '../user-signin/user-signin.component';
import {ForgotPasswordComponent} from '../user-signin/send-passwordlink.component';
import {ChangePasswordComponent} from '../user-signin/change-password.component';
import {MainHomeComponent} from '../main-home/main-home.component';
import {UserService} from '../shared/services/user.service';
import {TargetService} from '../shared/services/target.service';
import {UserTargetListComponent} from '../target/target.component';
import {UserTargetAddComponent} from '../target/target-add.component';
import {UserTargetEditComponent} from '../target/target-edit.component';
import {Ng4LoadingSpinnerModule} from 'ng4-loading-spinner';
import { ModalModule } from 'ngx-bootstrap/modal';
import {BsDropdownModule} from 'ngx-bootstrap';



/*tslint:disable*/

@NgModule({
  imports : [
    homeRouting, CommonModule, FormsModule, AngularMultiSelectModule,Ng4LoadingSpinnerModule,
    ModalModule.forRoot(),BsDropdownModule,
    ReCaptchaModule ],

  declarations : [

    HomeComponent,
    UserSignUpComponent,
    UserSignInComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
		MainHomeComponent,
		UserTargetListComponent,
		UserTargetAddComponent,
		UserTargetEditComponent,
  ],
  providers: [UserService, TargetService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class HomeModule{}
