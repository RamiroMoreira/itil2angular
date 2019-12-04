import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
    
  public static serverUrl = "";
//  public static serverUrl = "https://itil2angular.herokuapp.com"
  constructor(
  ) {
  }
  ngOnInit() {
    // Note: Below 'queryParams' can be replaced with 'params' depending on your requirements

  }
  public static initializeUrl(){
    if(window.location.hostname == "localhost"){
      this.serverUrl = location.protocol + '//' + location.hostname +":4000"
    }
    else{
      this.serverUrl = location.protocol + '//' + location.hostname
    }

  }
}