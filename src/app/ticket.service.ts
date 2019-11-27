import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WebsocketService } from './webSocket.service';
import { Component, OnInit } from '@angular/core';
import { HttpModule, Headers, Http } from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class TicketService implements OnInit {
  uri = 'http://localhost:4000';

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private webSocketService: WebsocketService,
    private router: Router
  ) {

  }
  ngOnInit() {

  }
  getTickets() {
    return this.http.get(`${this.uri}/tickets`);
  }
  getTicketById(id) {
    return this.http.get(`${this.uri}/tickets/${id}`);
  }
  addTicket(title, description) {
      this.webSocketService.newTicket({title: title, description: description});
  }
}

