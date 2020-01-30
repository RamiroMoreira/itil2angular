import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../user.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WebsocketService } from './../../../webSocket.service';
/*    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    hash: String*/
@Component({
  selector: 'app-create',
  templateUrl: './createUser.component.html',
  styleUrls: ['./createUser.component.css']
})
export class CreateUserComponent implements OnInit {
  createForm: FormGroup;
  constructor(
    private userService: UserService, 
    private fb: FormBuilder, 
    private router: Router,
    private webSocketService: WebsocketService
    ) {
    this.createForm = this.fb.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName:['', Validators.required],
    });
  }

  addUser(email, name, firstName,lastName) {
    this.webSocketService.newUser({email: email, name: name, firstName: firstName, lastName: lastName});
    this.router.navigate(['/users']);
  }

  ngOnInit() {
    /*this.tipoTicketService.getTipoTickets().subscribe(tipoTickets => {
      this.tipoTickets = tipoTickets.json();
      if(this.tipoTickets.length > 0){
        console.log("tipoTickets: "+this.tipoTickets[0]);
        this.createForm.controls['tipoTicket'].setValue(this.tipoTickets[0]._id);
      }
    });
    */
  }

}