import {Component, OnInit} from "@angular/core";
import {UserService} from "../../shared/services/user.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  isMe = false;
  myusername='';
  username='';
  isSelected = false;
  profile = {me:false, first_name:'John', last_name:'Smith', username:'', friends:0, email:''}
  constructor (
    private userService: UserService,
    public router: Router,
    private route: ActivatedRoute,
  ) {}
  ngOnInit():void{
    this.route.queryParams.subscribe(params => {
      if (params['me'] != undefined) {
        this.isMe = true
      }else {
        this.isMe = false
        this.isSelected = false
      }

    });


  }
  get isLoggedIn() {
    return this.userService.isLoggedIn();
  }
  get loggedInData() {
    return this.userService.getLoggedInData();
  }
  get hasUserName() {
    // if(this.isLoggedIn){
    //   if(this.loggedInData.username.length!=0) {
    //     return true
    //   }
    // }
    if (this.profile.username.length!=0)
      return true
    return false
  }

  selectProfile(){
    this.userService.userProfile(this.username).subscribe()
    // this.isSelected = true
    // this.profile.username = this.username

  }
}
