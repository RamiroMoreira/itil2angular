import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../ticket.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WebsocketService } from './../../webSocket.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  createForm: FormGroup;

  constructor(
    private ticketService: TicketService, 
    private fb: FormBuilder, 
    private router: Router,
    private webSocketService: WebsocketService
    ) {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      description: '',
    });
  }

  addTicket(title, description) {
    this.webSocketService.newTicket({title: title, description: description});
    this.router.navigate(['/list']);
  }

  ngOnInit() {
  }

}