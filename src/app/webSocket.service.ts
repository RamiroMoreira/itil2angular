import { TicketService } from './ticket.service';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';
import {ConfigService } from './config.service';
@Injectable()
export class WebsocketService {

  // private socket = io('https://itil2angular.herokuapp.com');
  private socket = io(ConfigService.serverUrl);
  constructor() { }

//   joinRoom(data) {
//     console.log(data);
//     this.socket.emit('join', data);
//   }

  newTicket(data) {
    this.socket.emit('newTicket', data);
  }

  newTicketCreated() {
    const observable = new Observable<{id: String, title: String, description: String, fechaIngreso: Date, tipoTicket: Object}>(observer => {
      this.socket.on('new ticket', (data) => {
        console.log("dataTipoTicket "+data.tipoTicket)
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
  newUser(data){
    this.socket.emit('newUser', data);
  }
  newUserCreated() {
    const observable = new Observable<{id: String, email: String, name: String, lastName: String, firstName:String}>(observer => {
      this.socket.on('new user', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
//   typing(data) {
//     this.socket.emit('typing', data);
//   }

//   receivedTyping() {
//     const observable = new Observable<{ isTyping: boolean}>(observer => {
//       this.socket.on('typing', (data) => {
//         observer.next(data);
//       });
//       return () => {
//         this.socket.disconnect();
//       };
//     });
//     return observable;
//   }

}