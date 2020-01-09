import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {AuthRequest} from '../../dtos/auth-request';
import { SignUpRequest } from 'src/app/dtos/sign-up-request';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup;
  // After first submission attempt, form validation will start
  submitted: boolean = false;
  // Error flag
  error: boolean = false;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.signUpForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(45)]],
      email: ['', [Validators.required, Validators.maxLength(45), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.minLength(12)]]
    });
  }

  /**
   * Form validation will start after the method is called, additionally an AuthRequest will be sent
   */
  signUpUser() {
    this.submitted = true;
    if (this.signUpForm.valid) {
      const authRequest: SignUpRequest = new SignUpRequest(this.signUpForm.controls.username.value,
        this.signUpForm.controls.email.value, this.signUpForm.controls.password.value);
      this.signUpRequest(authRequest);
    } else {
      console.log('Invalid input');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  /**
   * Send authentication data to the authService. If the authentication was successfully, the user will be forwarded to the message page
   * @param authRequest authentication data from the user login form
   */
  signUpRequest(signUpRequest: SignUpRequest) {
    console.log('Try to sign up user: ' + signUpRequest.username);
    this.authService.signUpUser(signUpRequest).subscribe(
      () => {
        console.log('Successfully logged in user: ' + signUpRequest.username);
        this.router.navigate(['/']);
      },
      error => {
        console.log('Could not log in due to:');
        console.log(error);
        this.error = true;
        if (typeof error.error === 'object') {
          this.errorMessage = error.error.errorMessage;
        } else {
          this.errorMessage = error.error.errorMessage;
        }
      }
    );
  }

  /**
   * Error flag will be deactivated, which clears the error message
   */
  vanishError() {
    this.error = false;
  }

  ngOnInit() {
  }

}
