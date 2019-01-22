import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {UserService} from '../../shared/services/user.service';
import {ToastaService} from 'ngx-toasta';

/*tslint:disable*/
@Component({
	templateUrl: './send-passwordlink.component.html',

})

export class ForgotPasswordComponent implements OnInit {
	credentials = {email: '', password: ''};
	isLoading: boolean = false;
	sendOK:boolean = false;
	constructor(private userService: UserService,
				private router: Router,
				private toastrService: ToastaService) {
	}

	ngOnInit() {
		// console.log("<<<< send-passwordlink-comp started >>>")

	}
	send(){
		let email = this.credentials.email;
		this.isLoading = true;
		this.userService.sendMailFor(this.credentials.email).subscribe(
			data =>{
				this.sendOK = true;
				this.isLoading = false;
				this.toastrService.success('Sent password reset link to ' + this.credentials.email);
			},
			err => {
				this.isLoading = false;
				if (err.indexOf("exist") > -1){
					this.toastrService.error('Can\'t find that email, sorry.')
				} else
					this.toastrService.error(err);
			}
		);
	}

}
