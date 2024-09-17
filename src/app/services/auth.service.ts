import {Injectable, signal, WritableSignal} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserInterface} from "../auth/user.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: WritableSignal<UserInterface | undefined | null> = signal(undefined);
  private apiUrl = environment.host;

  constructor(private http: HttpClient) { }

  checkToken() {
    return <Observable<{status: string, data: UserInterface, code: number}>>this.http.post(this.apiUrl+'token', {});
  }

  login(data: {email: string, password: string}) {
    return <Observable<{status: string, data: UserInterface, code: number}>>this.http.post(this.apiUrl+'login', data);
  }

  // signup(email: string, password: string, name: string){
  //   this.http.post(this.apiUrl+'signup', {email, password, name}).subscribe(res => console.log('signup', res));
  // }

  logout() {
    localStorage.setItem('token', '');
    this.currentUser.set(null);
  }
}
