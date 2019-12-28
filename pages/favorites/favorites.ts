import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { EventDetailPage } from '../eventDetail/eventDetail';
import { Day } from ' ../../data/models';
import { FavoriteService } from '../../data/favorite.service';
import { EventService } from '../../data/event.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public favoriteService: FavoriteService,
    public eventService: EventService,
  ) { }

  days:Day[] = [];
  tracks;
  activeDay: number = 0;

  ionViewDidEnter() {
    this.init();
  }

  init() {    
    this.days = cloneDeep(this.eventService.daysWithSessionsByTime);
    this.tracks = this.eventService.tracks;

    // filter favs
    this.days.map((day, index) => {
      day.rooms = day.rooms.filter(room => {
        if (this.favoriteService.favorites.indexOf(room.guid) !== -1) {
          // enthalten
          return true;
        } 
        return false;
      })
      if (index === this.days.length-1) {
        setTimeout(() => this.scrollToActiveDay(), 100);
      }
    })
  }

  scrollToActiveDay() {
    // mark active day if today is a congress day
    const today = new Date().getUTCDay();
    const isToday = this.days.filter(d => d.date.getUTCDay() === today);
    this.activeDay = isToday.length > 0 ? isToday[0].index-1 : this.activeDay;
    const elem = document.querySelector('#day-'+this.activeDay);
    if (elem !== null) {
      elem.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }
  }

  clickDetail(event) {
    this.presentEventDetailModal({event: event});
  }

  presentEventDetailModal(data) {
    let profileModal = this.modalCtrl.create(EventDetailPage, data);
    profileModal.present();
  }

  removeFavorite(room) {
    this.favoriteService.toggle(room.guid);
    this.init();
  }

}
