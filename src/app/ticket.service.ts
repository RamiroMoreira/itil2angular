import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WebsocketService } from './webSocket.service';
import { Component, OnInit } from '@angular/core';
import { HttpModule, Headers, Http } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ConfigService } from './config.service';
import { AuthenticationService } from './authentication.service';


@Injectable({
  providedIn: 'root'
})
export class TicketService implements OnInit {
  // uri = 'https://itil2angular.herokuapp.com';
  uri = ConfigService.serverUrl
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
    console.log("getting tickets");
    let payload;
    let token = localStorage.getItem('mean-token')
    let payloadJson;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      payloadJson = JSON.parse(payload);
    }
    return this.http.get(`${this.uri}/tickets`, {params:{payload:payloadJson}});
    
  }
  getTicketById(id) {
    return this.http.get(`${this.uri}/tickets/${id}`);
  }
  addTicket(title, description, tipoTicket) {
      console.log("new ticket");
      this.webSocketService.newTicket({title: title, description: description, tipoTicket: tipoTicket});
  }
}

