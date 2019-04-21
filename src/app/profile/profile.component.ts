import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../shared/services/profile.service';
import { ProfileDetails } from '../shared/models/profile.details.interface';
import { ProfileUpdate } from '../shared/models/profile.update.interface'
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileDetails: any;
  profileUpdate: ProfileUpdate;
  errors: string;  
  isRequesting: boolean;
  submitted: boolean = false;
  router : Router;

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.profileService.getProfileDetails()
    .subscribe((profileDetails: ProfileDetails) => {
      this.profileDetails = profileDetails;
      console.log(this.profileDetails);
    },
    error => {
      //this.notificationService.printErrorMessage(error);
    });
  }

  updateProfile({ value, valid }: { value: ProfileUpdate, valid: boolean }){
    this.submitted = true;
    this.isRequesting = true;
    this.errors='';
    if(valid)
    {
        this.profileService.updateProfile(value.firstName,value.lastName,value.username)
                  .pipe(finalize(() => this.isRequesting = false))
                  .subscribe(
                    result  => {if(result){
                        setTimeout(function () { window.location.reload(); }, 10)                         
                    }},
                    errors =>  this.errors = errors);
    }  
  }

}
