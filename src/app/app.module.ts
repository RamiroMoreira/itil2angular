import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListTicketComponent } from './components/tickets/list/listTicket.component';
import { CreateTicketComponent } from './components/tickets/create/createTicket.component';
import { EditTicketComponent } from './components/tickets/edit/editTicket.component';
import { RouterModule, Routes } from '@angular/router';
import { TicketService } from './ticket.service';
import { TipoTicketService } from './tipoTicket.service';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { WebsocketService} from './webSocket.service';
import { AuthenticationService} from './authentication.service';
import { MatToolbarModule, 
  MatFormFieldModule, 
  MatInputModule, 
  MatOptionModule, 
  MatSelectModule, 
  MatIconModule, 
  MatButtonModule, 
  MatCardModule, 
  MatTableModule, 
  MatDividerModule, 
  MatSnackBarModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from './config.service';
import { CreateUserComponent } from './components/users/create/createUser.component';
import { ListUserComponent} from './components/users/list/listUser.component';
import { LoginComponent} from './components/users/login/login.component';
import { UserService } from './user.service';
import { AuthGuardService } from './auth-guard.service';

const routes: Routes = [
  { path: 'createTicket', component: CreateTicketComponent, canActivate: [AuthGuardService] },
  { path: 'editTicket/:id', component: EditTicketComponent, canActivate: [AuthGuardService] },
  { path: 'listTicket', component: ListTicketComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: '/listTicket', pathMatch: 'full', canActivate: [AuthGuardService]},
  { path: 'users/add', component: CreateUserComponent, canActivate: [AuthGuardService]},
  { path: 'users', component: ListUserComponent, canActivate: [AuthGuardService]},
  { path: 'login', component: LoginComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    ListTicketComponent,
    CreateTicketComponent,
    EditTicketComponent,
    CreateUserComponent,
    ListUserComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes,{useHash: true}),
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatSnackBarModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    NgbModule
    
   ],
  providers: [TicketService, AuthGuardService, TipoTicketService, WebsocketService, ConfigService, UserService, AuthenticationService],
  bootstrap: [AppComponent]
})


export class AppModule {
  constructor(){
    ConfigService.initializeUrl();
  }
}
