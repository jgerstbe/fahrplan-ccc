import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as fahrplan from '../../data/36c3.json';
import { User } from '../../data/models';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  styleUrls: ['settings.css']
})
export class SettingsPage {
  user: User;
  fahrplan;

  constructor(
    public navCtrl: NavController,
    ) {
      this.fahrplan = fahrplan;
      this.fahrplan.timestamp = new Date(this.fahrplan.timestamp);
    }

  ngOnInit() {
    // const local = localStorage.getItem('user');
    // if (local) {
    //   this.loadUser();
    // } else {
    //   this.saveUser(new User("uuid"+new Date().getMilliseconds(), "Bob"+new Date().getMilliseconds()))
    // }  
  }

  loadUser() {
    let local = localStorage.getItem('fcppp_user');
    if (local) {
     this.user = JSON.parse(local);
    } 
  }

  saveUser() {    
    let local = localStorage.setItem('fcppp_user', JSON.stringify(this.user));
  }

  delete() {
    localStorage.removeItem('fcppp_user');
    // delete(this.user);
    // TODO call API delete
    // localStorage.clear();
  }

}
