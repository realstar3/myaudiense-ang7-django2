import {Component, AfterViewInit, EventEmitter, Output, OnInit, Input} from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbPanelChangeEvent,
  NgbCarouselConfig
} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {UserService} from '../services/user.service';
import {Router} from "@angular/router";
import { DomSanitizer } from '@angular/platform-browser';
import {Observable} from "rxjs";
declare var $: any;
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterViewInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  private eventsSubscription: any

  @Input() MyEvents: Observable<void>;

  public config: PerfectScrollbarConfigInterface = {};
  imageToShow: any;
  isImageLoading=true;
  constructor(private modalService: NgbModal,
              public router: Router,
              private sanitizer : DomSanitizer,
              private userService: UserService)
  {

  }
  ngOnInit(){


  }
  logout() {
    this.userService.logout();
    this.router.navigate(['/starter']);
  }
  get isLoggedIn() {
    return this.userService.isLoggedIn();
  }
  get GetProfile() {
    return this.userService.getMyProfile();
  }

  ngAfterViewInit() {
    this.dispImage();
    this.eventsSubscription = this.MyEvents.subscribe(() => {
      this.dispImage();
    })

  }



  dispImage() {
    let img_url = this.GetProfile.image;
    this.isImageLoading = true;
    this.userService.getImage(img_url)
      .subscribe(
        data => {
          let urlCreator = window.URL;
          this.imageToShow = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(data));
          this.isImageLoading = false;
        },
        error => {
          this.isImageLoading = false;
          console.log(error);
        });

  }

  mylink(){
    this.router.navigate(['/profile'], { queryParams: { me: true } });
  }




  // This is for Notifications
  notifications: Object[] = [
    {
      round: 'round-danger',
      icon: 'ti-link',
      title: 'Luanch Admin',
      subject: 'Just see the my new admin!',
      time: '9:30 AM'
    },
    {
      round: 'round-success',
      icon: 'ti-calendar',
      title: 'Event today',
      subject: 'Just a reminder that you have event',
      time: '9:10 AM'
    },
    {
      round: 'round-info',
      icon: 'ti-settings',
      title: 'Settings',
      subject: 'You can customize this template as you want',
      time: '9:08 AM'
    },
    {
      round: 'round-primary',
      icon: 'ti-user',
      title: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM'
    },
    {
      useravatar: 'assets/images/users/4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];
}
