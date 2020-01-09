import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/dtos/user';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private profileForm: FormGroup;

  private user: User;
  

  constructor(private userService: UserService, private formBuilder: FormBuilder ,private router: Router) {
    this.profileForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(45)]],
      email: ['', [Validators.required, Validators.maxLength(45), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.minLength(12)]],
      score: ['', [Validators.required]],
      playedGames: ['', [Validators.required]],
      scorePercentage: ['', [Validators.required]]
    });
   }

  ngOnInit() {
    this.userService.getMyUser()
      .subscribe((fetchedUser) => {
        this.user = fetchedUser;
        console.log(this.user);
      });
  }

  changeProfile(){
    this.router.navigate(['./changeprofile']);
    //window.open("./changeprofile", "_self");
  }
}