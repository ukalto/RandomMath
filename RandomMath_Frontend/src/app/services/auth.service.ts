import {Injectable} from '@angular/core';
import {AuthRequest} from '../dtos/auth-request';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import {Globals} from '../global/globals';
import { AuthResponse } from '../dtos/auth-response';
import { SignUpRequest } from '../dtos/sign-up-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authBaseUri: string = this.globals.backendUri + '/users';

  constructor(private httpClient: HttpClient, private globals: Globals) {
  }

  /**
   * Login in the user. If it was successful, a valid JWT token will be stored
   * @param authRequest User data
   */
  loginUser(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.authBaseUri}/login`, authRequest)
      .pipe(
        tap((authResponse) => this.setToken(authResponse.token))
      );
  }

  signUpUser(signUpRequest: SignUpRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.authBaseUri}`, signUpRequest)
      .pipe(
        tap((authResponse) => this.setToken(authResponse.token))
      );
  }


  /**
   * Check if a valid JWT token is saved in the localStorage
   */
  isLoggedIn() {
    return !!this.getToken() && (this.getTokenExpirationDate(this.getToken()).valueOf() > new Date().valueOf());
  }

  logoutUser() {
    console.log('Logout');
    localStorage.removeItem('authToken');
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  private setToken(authResponse: string) {
    localStorage.setItem('authToken', authResponse);
  }

  private getTokenExpirationDate(token: string): Date {

    const decoded: any = jwt_decode(token);
    if (decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

}
