import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
// import {ToastaService} from 'ngx-toasta';
import {UserService} from '../../shared/services/user.service';

/*tslint:disable*/
@Component({
	templateUrl: './change-password.component.html',
})

export class ChangePasswordComponent implements OnInit {

	isLoading = false;
	email;
	user_domain;
	firs_password;
	second_password;
	token;
	constructor(private userService: UserService,
				private router: Router,
				private route: ActivatedRoute,
				) {
	}

	ngOnInit() {
		// console.log('<<<< change-password comp started >>>');
		this.route.queryParams.subscribe(
			params => {
				this.email = params['user_email'];
				this.token = params['token'];
				if(this.hasWhiteSpace(this.email))
					this.email=this.email.split(' ').join('+');

				this.user_domain = this.email.split('@')[0] + '@';

			});
	}
	hasWhiteSpace(s) {
		return /\s/g.test(s);
	}
	sendPassword() {
		if (this.firs_password !== this.second_password) {
			// this.toastrService.error('Password is not equal.');
			return;
		}
		this.isLoading = true;
		this.userService.changePasswordFor(this.email, this.firs_password, this.token).subscribe(
			data => {
				this.isLoading = false;
				// this.toastrService.success('Your password is changed successfully.');
				this.router.navigate(['/starter']);
			},
			err => {
				this.isLoading = false;
				// this.toastrService.error(err);
			}
		);
	}

}
