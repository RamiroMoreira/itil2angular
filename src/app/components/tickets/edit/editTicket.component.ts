import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../../ticket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './editTicket.component.html',
  styleUrls: ['./editTicket.component.css']
})
export class EditTicketComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
