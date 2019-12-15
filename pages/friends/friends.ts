import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as fahrplan from '../../data/36c3.json';
import { User } from '../../data/models';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
  styleUrls: ['friends.css']
})
export class FriendsPage {
  user: User;
  fahrplan;

  constructor(
    public navCtrl: NavController
    ) {
      this.fahrplan = fahrplan;
      this.fahrplan.timestamp = new Date(this.fahrplan.timestamp);
    }

  ngOnInit() {
    const local = localStorage.getItem('user');
    if (local) {
      this.loadUser();
    } else {
      this.saveUser(new User("=12313ljhlj123", "Bob"))
    }
  }
  
  loadUser() {
    let local = localStorage.getItem('user');
    if (local) {
     this.user = JSON.parse(local);
    } 
  }

  saveUser(user: User) {
    // TODO call API to update name
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user))
  }

  delete() {
    // TODO call API delete
    delete(this.user);
    localStorage.clear();
  }

}
