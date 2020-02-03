import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';
import { ConfigService} from './config.service';
import { AppComponent } from './app.component';

export interface UserDetails {
    _id: string;
    email: string;
    name: string;
    exp: number;
    iat: number;
  }
  
  interface TokenResponse {
    token: string;
  }
  
  export interface TokenPayload {
    email: string;
    password: string;
    name?: string;
  }


@Injectable()
export class AuthenticationService {
  private token: string;
  uri = ConfigService.serverUrl

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('mean-token');
    AppComponent.userIsLogged = false;
    AppComponent.userIsLoggedChanged.emit(AppComponent.userIsLogged);
    this.router.navigateByUrl('/login');
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }

    
  }
  
  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private request(method: 'post'|'get', type: 'login'|'register'|'profile'|'tickets', user?: TokenPayload): Observable<any> {
    let base;
  
    if (method === 'post') {
      base = this.http.post(`${this.uri}/api/${type}`, user);
    } else {
      base = this.http.get(`${this.uri}/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
    }
  
    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
  
    return request;
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'login', user);
  }
}