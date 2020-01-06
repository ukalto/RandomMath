import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../global/globals';
import { User } from '../dtos/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userBaseUri: string = this.globals.backendUri + '/users' ;

  constructor(private httpClient: HttpClient, private globals: Globals) {
  }

  getMyUser(): Observable<User> {
    return this.httpClient.get<User>(`${this.userBaseUri}/me`);
  }

  saveProfileChanges() :Observable<Void> {
    
  }
}
