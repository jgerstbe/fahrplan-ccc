import { Component } from '@angular/core';
import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { Day } from ' ../../data/models';
import { FavoriteService } from '../../data/favorite.service';
import { EventService } from '../../data/event.service';
import { EventDetailPage } from '../eventDetail/eventDetail';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
  styleUrls: ['../../styles/sticky.css'],
})
export class FriendsPage {
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public favoriteService: FavoriteService,
    public eventService: EventService
  ) {
    console.log('params', params);
  }
  days: Day[] = [];
  tracks;
  friend: any;

  ionViewDidEnter() {
    if (!this.params.data.friendUuid) {
      return;
    }
    this.favoriteService
      .loadFriendsFavorites(this.params.data.friendUuid)
      .subscribe((data: any) => {
        console.log('GOT FRIEND DATA', data);
        this.friend = data;
        this.init();
      });
  }

  init() {
    this.days = cloneDeep(this.eventService.daysWithSessionsByTime);
    this.tracks = this.eventService.tracks;

    // filter favs
    this.days.map((day) => {
      day.rooms = day.rooms.filter((room) => {
        if (this.friend.favorites.indexOf(room.guid) !== -1) {
          // enthalten
          return true;
        }
        return false;
      });
    });

    // mark active day if today is a congress day
    const today = new Date().getUTCDay();
    const isToday = this.days.filter((d) => d.date.getUTCDay() === today);
  }

  clickDetail(event) {
    this.presentEventDetailModal({ event: event });
  }

  presentEventDetailModal(data) {
    let profileModal = this.modalCtrl.create(EventDetailPage, data);
    profileModal.present();
  }
}
