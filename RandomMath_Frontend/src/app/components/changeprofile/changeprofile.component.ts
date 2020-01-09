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
  private changeProfileForm: FormGroup;

  submitted: boolean = false;
  error: boolean = false;
  errorMessage: string = '';

  private user: User;
  

  constructor(private userService: UserService, private formBuilder: FormBuilder ,private router: Router) {
    this.changeProfileForm = this.formBuilder.group({
      email: ['', [Validators.maxLength(45), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password: ['', [Validators.minLength(12)]]
    });
   }

  ngOnInit() {
    this.userService.getMyUser()
      .subscribe((fetchedUser) => {
        this.user = fetchedUser;
        this.changeProfileForm.controls.email.setValue(fetchedUser.email);
        console.log(this.user);
      });
  }
   saveProfileChanges(){
    this.submitted = true;
    if (this.changeProfileForm.valid) {
      const authRequest: ChangeProfileRequest = new ChangeProfileRequest( this.changeProfileForm.controls.email.value, this.changeProfileForm.controls.password.value);
      this.changeProfileRequest(authRequest);
    } else {
      console.log('Invalid input');
    }
  }
  
  changeProfileRequest(changeProfileRequest: ChangeProfileRequest) {
    console.log('Try to change user with this email: ' + changeProfileRequest.email);
    this.userService.saveProfileChanges(changeProfileRequest).subscribe(
      () => {
        console.log('Successfully changed user with this email: ' + changeProfileRequest.email);
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