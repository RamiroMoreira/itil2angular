import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../../ticket.service';
import { TipoTicketService } from '../../../tipoTicket.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WebsocketService } from './../../../webSocket.service';
import { TipoTicket } from '../../../tipoTicket.model';

@Component({
  selector: 'app-create',
  templateUrl: './createTicket.component.html',
  styleUrls: ['./createTicket.component.css']
})
export class CreateTicketComponent implements OnInit {
  tipoTickets: TipoTicket[];
  createForm: FormGroup;
  constructor(
    private ticketService: TicketService, 
    private tipoTicketService: TipoTicketService, 
    private fb: FormBuilder, 
    private router: Router,
    private webSocketService: WebsocketService
    ) {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      description: '',
      tipoTicket: ''
    });
  }

  addTicket(title, description, tipoTicket) {
    var tipoId = tipoTicket.selectedOptions[0].value;
    var tipo = this.tipoTickets.find(x => x._id == tipoId);
    this.webSocketService.newTicket({title: title, description: description, tipoTicket: tipo});
    this.router.navigate(['/listTicket']);
  }

  ngOnInit() {
    this.tipoTicketService.getTipoTickets().subscribe(tipoTickets => {
      this.tipoTickets = tipoTickets.json();
      if(this.tipoTickets.length > 0){
        console.log("tipoTickets: "+this.tipoTickets);
        this.createForm.controls['tipoTicket'].setValue(this.tipoTickets[0]._id);
      }
    });
  }

}