import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { EventDetailPage } from '../eventDetail/eventDetail';
import * as fahrplan from '../../data/36c3.json';
import { Day } from ' ../../data/models';
import * as tracks from '../../data/tracks.json';
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
    this.eventService.conference.days.forEach(day => {
      const parsedDay = new Day(day.index, day.date, day.day_start, day.day_end, day.rooms);
      this.days.push(parsedDay);
    });
    console.log(this.days[0])
  }

  clickDetail(event) {
    this.presentEventDetailModal({event: event});
  }

  presentEventDetailModal(data) {
    let profileModal = this.modalCtrl.create(EventDetailPage, data);
    profileModal.present();
  }

}
