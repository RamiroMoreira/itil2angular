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
  page = 1;
  pageSize = 10;
  collectionSize = 0;
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
        this.collectionSize = this.collectionSize+1;
      }
      
    });
  }

  ngOnInit() {
    
    this.ticketService.getTickets().subscribe(tickets => {
      this.tickets = tickets.json();
      this.collectionSize = this.tickets.length;
    });
  }

  get tickets2(): Ticket[] {
    if(this.tickets){
      return this.tickets.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
    else{
      return [];
    }
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
