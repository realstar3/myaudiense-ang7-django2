import {Component, OnInit, HostListener, Output, EventEmitter, ViewChild} from '@angular/core';
import { Router } from '@angular/router';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {UserService} from '../../shared/services/user.service';

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject, Subscription} from "rxjs";
import { ToolbarHelpers } from './toolbar.helpers';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-full-layout',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit {

  @Output() AfterLogon = new EventEmitter<void>();
  color = 'defaultdark';
  showSettings = false;
  showMinisidebar = false;
  showDarktheme = false;
  isMobile = false;
  isLoading = false;
  registerForm: FormGroup;
  submitted = false;
  toolbarHelpers = ToolbarHelpers;

  private eventsSubject: Subject<void> = new Subject<void>();
  public innerWidth: any;
  public config: PerfectScrollbarConfigInterface = {};


  constructor(
    private toast:ToastrService,
    public router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {

    this.registerForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      },
    );
  }


  ngOnInit() {

    if (this.router.url === '/') {
      this.router.navigate(['/starter']);
    }

    this.handleLayout();
  }

  ngAfterViewInit() {


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

  get GetProfile() {
    return this.userService.getMyProfile();
  }

  login() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.userService.login(this.registerForm.value['email'], this.registerForm.value['password'])
      .subscribe(
        data => {
          this.isLoading = false;
              this.toast.success("Success!");
          this.eventsSubject.next();


        },
        errMessage => {
          this.isLoading = false;
          // if (err.indexOf("Unauthorized") != -1)
          this.toast.error(errMessage);
        }

      )
  }

  // cssChange(e) {
  //   console.log(e);
  // }
}
