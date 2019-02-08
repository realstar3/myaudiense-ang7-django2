import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { StarterComponent } from './starter.component';
import {UserSignInComponent} from '../component/signin/signin.component';
import {SignupComponent} from '../component/signup/signup.component';
import {ActiveComponent} from '../component/signup/active.component';
import {ForgotPasswordComponent} from '../component/signin/send-passwordlink.component';
import {ChangePasswordComponent} from '../component/signin/change-password.component';
import {ReCaptchaModule} from 'angular2-recaptcha';
import {ProfileComponent} from "../component/profile/profile.component";
import {FileUploadModule} from "ng2-file-upload";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ToastaModule} from "ngx-toasta";



const routes: Routes = [
  {
    path: 'starter',
    data: {
      title: 'Starter Page',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Starter Page' }
      ]
    },
    component: StarterComponent
  },
  {
    path: 'signin',
    data: {
      title: 'LogIn Page',
    },
    component: UserSignInComponent
  },
  {
    path: 'signup',
    data: {
      title: 'SignUp Page',
    },
    component: SignupComponent
  },
  { path: 'active', component: ActiveComponent},
  { path: 'forgot', component: ForgotPasswordComponent},
  { path: 'change', component: ChangePasswordComponent},
  { path: 'profile', component: ProfileComponent},


];

@NgModule({
  imports: [FormsModule, CommonModule, ReactiveFormsModule,FileUploadModule,FlexLayoutModule,
    RouterModule.forChild(routes), ReCaptchaModule, ToastaModule.forRoot()],
  declarations: [StarterComponent, UserSignInComponent,
    SignupComponent, ActiveComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    ProfileComponent
  ]
})
export class StarterModule {}
