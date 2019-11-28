import { TicketService } from './ticket.service';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';

@Injectable()
export class WebsocketService {

  private socket = io('http://localhost:4000');
  constructor() { }

//   joinRoom(data) {
//     console.log(data);
//     this.socket.emit('join', data);
//   }

  newTicket(data) {
    this.socket.emit('newTicket', data);
  }

  newTicketCreated() {
    const observable = new Observable<{id: String, title: String, description: String}>(observer => {
      this.socket.on('new ticket', (data) => {
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