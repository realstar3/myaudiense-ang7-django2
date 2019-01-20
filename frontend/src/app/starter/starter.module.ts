import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { StarterComponent } from './starter.component';
import {UserSignInComponent} from '../layouts/signin/signin.component';
import {SignupComponent} from '../layouts/signup/signup.component';
import {ActiveComponent} from '../layouts/signup/active.component';
import {ForgotPasswordComponent} from '../layouts/signin/send-passwordlink.component';
import {ChangePasswordComponent} from '../layouts/signin/change-password.component';
import {ReCaptchaModule} from 'angular2-recaptcha';
import {ProfileComponent} from "../layouts/profile/profile.component";


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
  imports: [FormsModule, CommonModule, ReactiveFormsModule,
    RouterModule.forChild(routes), ReCaptchaModule],
  declarations: [StarterComponent, UserSignInComponent,
    SignupComponent, ActiveComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    ProfileComponent
  ]
})
export class StarterModule {}
