import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../ticket.service';
import { Router } from '@angular/router';
import { Ticket } from '../../ticket.model';
import { MatTableDataSource } from '@angular/material';
import { WebsocketService } from './../../webSocket.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  tickets: Ticket[];
  displayedColumns = ['title', 'description'];

  constructor(
    private ticketService: TicketService, 
    private router: Router,
    private webSocketService: WebsocketService
    ) { 
    this.webSocketService.newTicketCreated().subscribe(data => {
      if(!this.tickets){
      }
      else{
        this.tickets.push(data);
      }
      
    });
  }

  ngOnInit() {
    
    this.ticketService.getTickets().subscribe(tickets => {
      this.tickets = tickets.json();
    });
  }

  // fetchTickets() {
  //   this.ticketService
  //   .getTickets()
  //   .subscribe((tickets: Ticket[]) => {
  //     this.tickets = tickets;
  //     console.log('Data requested ... ');
  //     console.log(this.tickets);
  //   });
  // }

 


}
