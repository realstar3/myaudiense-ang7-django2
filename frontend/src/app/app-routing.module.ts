import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {NotFoundComponent} from './not-found/notfound.component';
import {ChangePasswordComponent} from './user-signin/change-password.component';
import {ActiveComponent} from './user-signup/active.component';

import {UserTargetEditComponent} from './target/target-edit.component';
import {UserTargetAddComponent} from './target/target-add.component';

import {UserTargetListComponent} from './target/target.component';
import {ForgotPasswordComponent} from './user-signin/send-passwordlink.component';
import {UserSignInComponent} from './user-signin/user-signin.component';
import {UserSignUpComponent} from './user-signup/user-signup.component';
import {AuthGuard} from './shared/guards/auth-guard.service';

const routes: Routes = [
  {path: '', component: HomeComponent, data: {cloudBackgroundShow: true, indexContentShow: true}},
  {path: 'signup', component: UserSignUpComponent, data: {cloudBackgroundShow: false}},
  {path: 'signin', component: UserSignInComponent, data: {cloudBackgroundShow: false}},
  {path: 'forgot', component: ForgotPasswordComponent},
  {path: 'targets', component: UserTargetListComponent, canActivate: [AuthGuard], data: {cloudBackgroundShow: false}},
  {path: 'targets/add', component: UserTargetAddComponent, canActivate: [AuthGuard], data: {cloudBackgroundShow: false}},
  {path: 'targets/edit/:id', component: UserTargetEditComponent, canActivate: [AuthGuard], data: {cloudBackgroundShow: false}},
  {path: 'front/active', component: ActiveComponent},
  {path: 'front/change', component: ChangePasswordComponent},

  {path: '**', component: NotFoundComponent},
];

// export const appRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes,{ useHash: true });
@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
