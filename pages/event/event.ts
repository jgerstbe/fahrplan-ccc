import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { EventDetailPage } from '../eventDetail/eventDetail';
import { Day } from ' ../../data/models';
import { FavoriteService } from '../../data/favorite.service';
import { EventService } from '../../data/event.service';

@Component({
  selector: 'page-event',
  templateUrl: 'event.html'
})
export class EventPage {

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public favoriteService: FavoriteService,
    public eventService: EventService,
  ) { }

  days:Day[] = [];
  tracks;

  ngOnInit() {
    this.tracks = this.eventService.tracks;
    this.eventService.conference.days.forEach((day, index) => {
      const parsedDay = new Day(day.index, day.date, day.day_start, day.day_end, day.rooms);
      this.days.push(parsedDay);
      if (index === this.eventService.conference.days.length-1) {
        setTimeout(() => this.scrollToActiveDay(), 100);
      }
    });
  }

  scrollToActiveDay() {
    // mark active day if today is a congress day
    const today = new Date().getUTCDay();
    const isToday = this.days.filter(d => d.date.getUTCDay() === today);
    const activeDay = isToday.length > 0 ? isToday[0].index-1 : 0;
    const elem = document.querySelector('#day-'+activeDay);
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

}
