import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { EventDetailPage } from '../eventDetail/eventDetail';
import * as fahrplan from '../../data/36c3.json';
import { Day } from ' ../../data/models';
import * as tracks from '../../data/tracks.json';
import { FavoriteService } from '../../data/favorite.service';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public favoriteService: FavoriteService
  ) { }

  days:Day[] = [];
  activeDay: number = 0;
  tracks = tracks;

   ionViewDidEnter() {
    this.init();
  }

  init() {    
    this.days = [];
    fahrplan.schedule.conference.days.forEach(day => {
      const parsedDay = new Day(day.index, day.date, day.day_start, day.day_end, day.rooms);
      // merge rooms into a single list
      let allRooms = parsedDay.rooms.Adams.concat(parsedDay.rooms.Borg, parsedDay.rooms.Clarke, parsedDay.rooms.Dijkstra, parsedDay.rooms.Eliza);
      // sort rooms
      allRooms.sort(function(a, b) {
        // const startA = Number(a.start.replace(":", ""));
        // const startB = Number(b.start.replace(":", ""));
        // const startA = new Date(a.date);
        // const startB = new Date(b.date);
        const startA = a.date;
        const startB = b.date;
        // compare
        if (startA > startB) {
          return 1;
        }
        if (startA < startB) {
          return -1;
        }
        if (startA === startB) {
          const durA = Number(a.duration.replace(":", ""));
          const durB = Number(b.duration.replace(":", ""));
          // TODO mark error
          if (durA > durB) {
            return 1;
          }
          if (durA < durB) {
            return -1;
          }
          return 0;
        }
        return 0;
      });
      // push
      parsedDay.rooms = allRooms;
      this.days.push(parsedDay);
    });

    this.days.map(day => {
      day.rooms = day.rooms.filter(room => {
        if (this.favoriteService.favorites.indexOf(room.guid) !== -1) {
          // enthalten
          return true;
        } 
        return false;
      })
    })

    // mark active day if today is a congress day
    const today = new Date().getUTCDay();
    const isToday = this.days.filter(d => d.date.getUTCDay() === today);
    console.log("activeDay is today", isToday.length?true:false);
    this.activeDay = isToday.length > 0 ? isToday[0].index-1 : this.activeDay;
  }

  calcEnd(start, duration) {
    start = start.split(":");
    duration = duration.split(":");
    const startHour: number = Number(start[0]),
          startMinutes: number = Number(start[1]),
          durationHour: number = Number(duration[0]),
          durationMinutes: number = Number(duration[1]);
    let h: number = 0, m: number = 0;
    
    h = startHour + durationHour;
    m = startMinutes + durationMinutes;

    if (m > 60) {
      h += (m - m%60)/60;
      m = m%60;
    }

    if (h >= 24) {
      h -= 24;
    }

    return h+":"+m;
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
