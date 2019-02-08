import {Component, OnInit} from "@angular/core";
import {UserService} from "../../shared/services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import { DomSanitizer } from '@angular/platform-browser';
import {ToastaService} from "ngx-toasta";
import { FileUploader } from 'ng2-file-upload';
import {AppSettings} from "../../app.constant";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {until} from "selenium-webdriver";
import elementIsSelected = until.elementIsSelected;
import {Subscription} from "rxjs";
const URL = 'http://' + AppSettings.API_ENDPOINT + '/api/auth/FileUpload/';
@Component({
  templateUrl: './profile.component.html',
  styles:[`
    .my-drop-zone { border: dotted 3px lightgray; }
    .nv-file-over { border: dotted 3px red; } /* Default class applied to drop zones on over */
    .another-file-over-class { border: dotted 3px green; }
  `]
})
export class ProfileComponent implements OnInit {
  isMe = false;
  isFriend = undefined;

  username='';
  isSelected = false;
  imageToShow: any=[];
  isImageLoading = true;
  imageFriendToShow:any=[];
  isFriendImageLoading:any=[];
  feedbackImageToShow:any=[];
  isFeedbackImageLoading:any=[];
  positive_reviews = 0;
  negative_reviews = 0;
  public uploader:FileUploader;
  closeResult:string;
  event_content:string;
  review_content:string;
  private subscription:Subscription;


  constructor (
    private userService: UserService,
    public router: Router,
    public toastaService: ToastaService,
    private route: ActivatedRoute,
    private sanitizer : DomSanitizer,
    private modalService: NgbModal

  ) {
    this.initFileUploader();

  }

  ngOnInit():void{
    this.subscription = this.userService.changeEmitted$.subscribe(
      text => {
        console.log(text);
        if(text === "logged"){
          this.dispImage();
          this.CheckFriend()
        }

      });

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
  open(content) {
    this.modalService.open(content).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  saveReview(isPositive:boolean){
    if(this.event_content.length==0 || this.review_content.length ==0)
      return;
    let send_data = {
      receiver:this.username,
      event_content:this.event_content,
      review_content:this.review_content
    }
    if(isPositive == true) {
      send_data['isPositive'] = true;
    }else {
      send_data['isPositive'] = false;
    }

    this.userService.leaveReview(send_data).subscribe(
      data=>{
        if (this.modalService.hasOpenModals()){
          this.modalService.dismissAll(ModalDismissReasons.ESC)
        }

        this.toastaService.success("Saved successfully.");
        this.selectProfile();
      },
      err=>{
        this.toastaService.error(err);
      }
    )

  }

  initFileUploader(){
    this.uploader = new FileUploader(
      {
        url: URL ,
        parametersBeforeFiles:true,
        additionalParameter:{username: this.GetProfile.username},
        filters: [{
          name: 'extension',
          fn: (item: any): boolean => {
            const fileExtension = item.name.slice(item.name.lastIndexOf('.') + 1).toLowerCase();
            return fileExtension === 'jpg' || fileExtension === 'png';
          }
        }],
        method: 'POST',
        autoUpload: false,
        headers: [{
          name: 'Authorization',
          value : this.userService.getToken()
        }],
      }
    );
    this.uploader.onBuildItemForm = (item, form) => {

      this.uploader.queue.forEach((elem)=> {

        elem.url = URL + elem.file.name;
        console.log(elem.url);
      });
    };
    this.uploader.onSuccessItem = ()=>{
      this.toastaService.success('Image changed successfully.')
      this.userService.userProfile(this.username).subscribe(
        data=>{
          this.isSelected = true
          this.dispImage();
          this.userService.emitChange('Data from child');


        },
        err=>{
          this.isSelected = false
          this.toastaService.error(err);


        }
      )

    }
    this.uploader.onErrorItem = (item, response, status, response_headers)=>{

      this.toastaService.error("Upload failed, status code:" + status.toString())

    }
    this.uploader.onAfterAddingFile = (item) => {

      this.uploader.queue.forEach((elem)=> {
        if (item!==elem){

          elem.remove()
        }
      });

      let reader = new FileReader();
      reader.onloadend = () => {
        this.imageToShow = reader.result;
      };
      reader.readAsDataURL(item._file);

    }
  }

  removeUploaderItem(){

    this.initFileUploader();
    let img_url = this.GetProfile.image;
    this.isImageLoading = true;
    if(img_url.length!=0){
      this.userService.getImage(img_url)
        .subscribe(
          data => {
            let urlCreator = window.URL;
            let b = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(data));
            this.imageToShow = b;
            this.isImageLoading = false;
          },
          error => {
            this.isImageLoading= true;
            console.log(error);
          });
    }

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
      if(friends[i].friend_image.length!=0){
        this.isFriendImageLoading[i] = true
        this.userService.getImage(friends[i].friend_image)
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
      else{
        this.isFriendImageLoading[i] = true
      }


    }
    let reviews = this.userService.getReviews();
    let len = reviews.length;
    this.positive_reviews = 0
    this.negative_reviews = 0
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
  CheckFriend(){
    let my = this.userService.getMyProfile()
    if (this.GetFriends.length!=0){
      this.GetFriends.forEach(p=>{

            if (p.friend_name === my.username){
              this.isFriend = true;
              console.log("this is my friend")
            }

          })
    }
  }
  changeProfile(username){
    this.router.navigate(['profile'], { queryParams: { username: username } });
  }

  selectProfile(){
    this.CheckMe()

    if(this.isMe){
      if(this.userService.getMyProfile().username==undefined){
        this.router.navigate(['/starter']);
        return
      }
      this.username = this.userService.getMyProfile().username;
    }
    this.userService.userProfile(this.username).subscribe(
      data=>{
        this.isSelected = true
        this.CheckFriend()
        this.dispImage();


      },
      err=>{
        this.isSelected = false
        this.toastaService.error(err);


      }
    )

  }
  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
    this.hasAnotherDropZoneOver = e;
  }

  requestFriend(){
    let friend_user_name = this.username
    this.userService.RequestFriend(friend_user_name).subscribe(
      data=>{
        this.toastaService.success("OK")
        this.isFriend = true

      }
    )

  }

}
