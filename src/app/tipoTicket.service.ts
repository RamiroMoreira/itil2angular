import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WebsocketService } from './webSocket.service';
import { Component, OnInit } from '@angular/core';
import { HttpModule, Headers, Http } from '@angular/http';
import {ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})
export class TipoTicketService implements OnInit {
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
  getTipoTickets() {
    console.log("getting tickets");
    return this.http.get(`${this.uri}/tipoTickets`);
  }
}

