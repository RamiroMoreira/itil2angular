import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../user.service';
import { Router } from '@angular/router';
import { User } from '../../../user.model';
import { MatTableDataSource } from '@angular/material';
import { WebsocketService } from './../../../webSocket.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-list',
  templateUrl: './listUser.component.html',
  styleUrls: ['./listUser.component.css']
})
export class ListUserComponent implements OnInit {
  users: User[];
  displayedColumns = ['email', 'lastName', 'firstName', 'name'];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  format: string;
  timezone: string;
  constructor(
    private userService: UserService, 
    private router: Router,
    private webSocketService: WebsocketService,
    ) { 

    this.webSocketService.newUserCreated().subscribe(data => {
      if(!this.users){
      }
      else{
        this.users.push(data);
        //this.users = _.sortBy(this.users, 'fechaIngreso').reverse();
        this.collectionSize = this.collectionSize+1;
      }
      
    });
  }

  ngOnInit() {
    
    this.userService.getUsers().subscribe(users => {
      this.users = users.json();
      this.collectionSize = this.users.length;
    });
  }

  get usersList(): User[] {
    if(this.users){
      return this.users.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
    else{
      return [];
    }
  }  
}
