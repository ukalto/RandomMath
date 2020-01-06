import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Globals {
  readonly backendUri: string = 'http://localhost:3000';
}
