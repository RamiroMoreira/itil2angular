import { Component,Output, Input, EventEmitter} from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Observable, Subject } from  'rxjs/Rx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isCollapsed = false;
  public isCollapsedUser = false;
  title = 'frontend';
  @Input() public static userIsLogged : boolean;
  @Output() public static userIsLoggedChanged = new EventEmitter<Object>();

  constructor(private auth: AuthenticationService, private router: Router){
      
      AppComponent.userIsLogged = this.auth.isLoggedIn()
      AppComponent.userIsLoggedChanged.emit(AppComponent.userIsLogged);
      console.log(AppComponent.userIsLogged);

    }
    get getIsCollapsed() {
      return AppComponent.userIsLogged;
    }
    
    get getUsuarioMail(){
      return this.auth.getUserDetails().email;
    }
    
    logout(){
      this.auth.logout();
    }
}
