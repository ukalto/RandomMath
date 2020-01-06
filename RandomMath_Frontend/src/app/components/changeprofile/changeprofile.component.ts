import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/dtos/user';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {Router} from '@angular/router';
import { ChangeProfileRequest } from 'src/app/dtos/change-profile-request';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-changeprofile',
  templateUrl: './changeprofile.component.html',
  styleUrls: ['./changeprofile.component.scss']
})
export class ChangeProfileComponent implements OnInit {
  private changedProfileForm: FormGroup;

  submitted: boolean = false;
  error: boolean = false;
  errorMessage: string = '';

  private user: User;
  

  constructor(private userService: UserService, private formBuilder: FormBuilder ,private router: Router) {
    this.changedProfileForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
   }

  ngOnInit() {
    this.userService.getMyUser()
      .subscribe((fetchedUser) => {
        this.user = fetchedUser;
        console.log(this.user);
      });
  }
   saveProfileChanges(){
    this.submitted = true;
    if (this.changedProfileForm.valid) {
      const authRequest: ChangeProfileRequest = new ChangeProfileRequest(this.changedProfileForm.controls.username.value,
        this.changedProfileForm.controls.email.value, this.changedProfileForm.controls.password.value);
      this.changeProfileRequest(authRequest);
    } else {
      console.log('Invalid input');
    }
  }
  
  changeProfileRequest(changeProfileRequest: ChangeProfileRequest) {
    console.log('Try to sign up user: ' + changeProfileRequest.username);
    this.changeProfileRequest.saveProfileChanges(changeProfileRequest).subscribe(
      () => {
        console.log('Successfully changed user: ' + changeProfileRequest.username);
        this.router.navigate(['/profile']);
      },
      error => {
        console.log('Could not save changes duo to:');
        console.log(error);
        this.error = true;
        if (typeof error.error === 'object') {
          this.errorMessage = error.error.errorMessage;
        } else {
          this.errorMessage = error.errorMessage;
        }
      }
    );
  }
}