import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as fahrplan from '../../data/36c3.json';
import { User } from '../../data/models';
import { FavoriteService } from '../../data/favorite.service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  styleUrls: ['settings.css']
})
export class SettingsPage {
  fahrplan;
  friend_id:string = '';
  editUUID:boolean = false;

  constructor(
    public navCtrl: NavController,
    public favoriteService: FavoriteService
  ) {
    this.fahrplan = fahrplan;
    this.fahrplan.timestamp = new Date(this.fahrplan.timestamp);
  }

  ngOnInit() {
  }

  onAddFriend() {
    console.warn(this.friend_id)
    this.favoriteService.addFriend(this.friend_id);
    this.friend_id = '';
  }

  onDeleteFriend(id) {
    this.favoriteService.removeFriend(id);
  }

  saveUUID() {
    localStorage.setItem('fpccc_uuid', this.favoriteService.uuid);
    this.favoriteService.favorites = [];
    this.favoriteService.friends = [];
    this.favoriteService.load();
    this.editUUID = false;
  }

}
