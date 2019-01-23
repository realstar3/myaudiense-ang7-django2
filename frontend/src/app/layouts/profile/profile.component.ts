import {Component, OnInit} from "@angular/core";
import {UserService} from "../../shared/services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import { DomSanitizer } from '@angular/platform-browser';
import {ToastaService} from "ngx-toasta";

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  isMe = false;
  myusername='';
  username='';
  isSelected = false;
  imageToShow: any=[];
  isImageLoading = true;
  imageFriendToShow:any=[]
  isFriendImageLoading:any=[]
  feedbackImageToShow:any=[];
  isFeedbackImageLoading:any=[];
  positive_reviews = 0
  negative_reviews = 0


  constructor (
    private userService: UserService,
    public router: Router,
    private toastaService: ToastaService,
    private route: ActivatedRoute,
    private sanitizer : DomSanitizer
  ) {}
  ngOnInit():void{

    this.route.queryParams.subscribe(params => {
      this.isImageLoading = true
      this.positive_reviews = 0
      this.negative_reviews = 0
      if (params['me'] != undefined && params['me'] == 'true') {
        this.isMe = true
        this.selectProfile()
      }
      else
      if (params['username']!=undefined){
        this.isMe = false
        this.username = params['username'];
        this.selectProfile()
      } else {
        this.isMe = false
        this.isSelected = false
      }


    });

  }


  dispImage() {
    let img_url = this.GetProfile.image;
    this.isImageLoading = true;
    if(img_url.length!=0){
      this.userService.getImage(img_url)
        .subscribe(
          data => {
            let urlCreator = window.URL;
            this.imageToShow = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(data));
            this.isImageLoading = false;
          },
          error => {
            this.isImageLoading= true;
            console.log(error);
          });
    }

    let friends = this.userService.getFriends();
    let l = friends.length
    for(let i=0; i<l; i++){
      if(friends[i].image.length!=0){
        this.isFriendImageLoading[i] = true
        this.userService.getImage(friends[i].image)
          .subscribe(
            data => {
              let urlCreator = window.URL;
              this.imageFriendToShow[i] = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(data));
              this.isFriendImageLoading[i] = false
            },
            error => {
              this.isFriendImageLoading[i] = true;
              console.log(error);
            });
      }


    }
    let reviews = this.userService.getReviews();
    let len = reviews.length;
    for(let i=0; i<len; i++){
      this.isFeedbackImageLoading[i] = true
      if(reviews[i]['is_positive']==true)
        this.positive_reviews = this.positive_reviews + 1
      else
        this.negative_reviews = this.negative_reviews + 1
      if(reviews[i].image.length!=0){
        this.userService.getImage(reviews[i].image)
          .subscribe(
            data => {
              let urlCreator = window.URL;
              this.feedbackImageToShow[i] = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(data));
              this.isFeedbackImageLoading[i] = false
            },
            error => {
              this.isFeedbackImageLoading[i] = true;
              console.log(error);
            });
      }


    }


  }
  get isLoggedIn() {
    this.CheckMe()
    return this.userService.isLoggedIn();
  }
  get GetProfile() {
    if (this.isMe){
      return this.userService.getMyProfile();
    }
    else{
      return this.userService.getUserProfile();
    }

  }
  get GetReviews(){
    return this.userService.getReviews();
  }
  get GetFriends(){
    return this.userService.getFriends()

  }
  CheckMe(){
    let my = this.userService.getMyProfile()
    if (my){
      if(my.username === this.username){
        this.isMe = true
      }
    }
  }
  changeProfile(username){
    this.router.navigate(['profile'], { queryParams: { username: username } });
  }
  selectProfile(){
    this.CheckMe()

    if(this.isMe){
      this.username = this.userService.getMyProfile().username;
    }
    this.userService.userProfile(this.username).subscribe(
      data=>{
        this.isSelected = true
        this.dispImage();


      },
      err=>{
        this.isSelected = false
        this.toastaService.error(err);


      }
    )

  }

}
