import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Globals } from '../global/globals';
import { User } from '../dtos/user';
import { Observable } from 'rxjs';
import { ChangeProfileRequest } from '../dtos/change-profile-request';
import { UserSearchResult } from '../dtos/user-search-result';

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

  saveProfileChanges(changeProfileRequest: ChangeProfileRequest) : Observable<Object> {
    return this.httpClient.patch<Object>(`${this.userBaseUri}/me`, changeProfileRequest);
  }

  postScore(score: number):  Observable<Object> {
    return this.httpClient.post<Object>(`${this.userBaseUri}/score`, { score });
  }

  getUsersOrderedBy(sort: string): Observable<UserSearchResult> {
    const params = new HttpParams()
      .set('sort', sort);
    return this.httpClient.get<UserSearchResult>(`${this.userBaseUri}/leaderboard`, { params });
  }
}
