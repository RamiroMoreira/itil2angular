import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../../../authentication.service';
import { Router } from '@angular/router';
import {AppComponent} from '../../../app.component';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials: TokenPayload = {
    email: '',
    password: ''
  };
  public errorMessage = "";
  get getErrorMessage(){
    return this.errorMessage;
  }

  cleanMessage(event: any) { // without type info
    this.errorMessage = "";
  }

  constructor(private auth: AuthenticationService, private router: Router) {}

  login() {
    this.auth.login(this.credentials).subscribe(() => {
      AppComponent.userIsLogged = true;
      AppComponent.userIsLoggedChanged.emit(AppComponent.userIsLogged);
      this.router.navigateByUrl('/listTicket');
      
    }, (err) => {
      this.errorMessage = "Wrong password or user.";
    });
  }
}