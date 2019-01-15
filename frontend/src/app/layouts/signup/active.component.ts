import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../shared/services/user.service';
import {ToastaService} from 'ngx-toasta';

@Component({
  template: ''
})
export class ActiveComponent implements OnInit {
  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private userService: UserService,
      private toastaService: ToastaService
    ) {}
  token: string;
  myData: any[] = [];
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      // console.log(this.token);
      });

    this.userService.activeRequest(this.token).subscribe(
      (res: any) => {
         this.myData = res.data;
         this.router.navigate(['/']);
      },
      err => {
       this.toastaService.error(err);
      }
    );
  }
}