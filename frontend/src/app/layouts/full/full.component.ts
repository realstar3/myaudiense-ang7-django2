import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {UserService} from '../../shared/services/user.service';
import {ToastaService, ToastaConfig, ToastOptions, ToastData} from 'ngx-toasta';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-full-layout',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit {
  color = 'defaultdark';
  showSettings = false;
  showMinisidebar = false;
  showDarktheme = false;
  isMobile = false;
  isLoading = false;
  registerForm: FormGroup;
  submitted = false;
  credentials = { username: '', password: '' };

  public innerWidth: any;

  public config: PerfectScrollbarConfigInterface = {};

  constructor(
    public router: Router,
    private userService: UserService,
    private toastaService: ToastaService,
    private toastaConfig: ToastaConfig,
    private formBuilder: FormBuilder
  ) {
    this.toastaConfig.theme = 'default';
     this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    },
      );
  }

  ngOnInit() {
    if (this.router.url === '/') {
      this.router.navigate(['/dashboard/dashboard1']);
    }
    this.handleLayout();
  }
  get f() { return this.registerForm.controls; }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.handleLayout();
  }

  toggleSidebar() {
    this.showMinisidebar = !this.showMinisidebar;
  }
  hiddenSidebar() {
    if (this.isMobile) {
      // this.toggleSidebar();
      this.showMinisidebar = true;
    }
  }
  handleLayout() {
    this.innerWidth = window.innerWidth;
    // console.log(this.innerWidth)
    if (this.innerWidth < 992) {
      this.showMinisidebar = true;
      this.isMobile = true;
    } else {
      this.showMinisidebar = false;
      this.isMobile = false;
    }
  }
  /**
   * Is the user logged in?
   */
  get isLoggedIn() {
    return this.userService.isLoggedIn();
  }
  login() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.userService.login(this.credentials.username, this.credentials.password).subscribe(
      data => {
        this.isLoading = false;
        this.toastaService.success('Success');
        this.router.navigate(['/']);
      },
      errMessage => {
        this.isLoading = false;
        // if (err.indexOf("Unauthorized") != -1)
        this.toastaService.error(errMessage);
      }
    );
  }

  // cssChange(e) {
  //   console.log(e);
  // }
}
