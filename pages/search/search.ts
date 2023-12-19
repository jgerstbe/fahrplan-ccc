import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { EventService } from '../../data/event.service';
import { EventDetailPage } from '../eventDetail/eventDetail';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  styleUrls: ['search.css'],
})
export class SearchPage {
  sessions = [];

  constructor(
    public modalCtrl: ModalController,
    public eventService: EventService
  ) {}

  ionViewDidEnter() {
    this.init();
  }

  init() {
    if (!this.eventService?.conference)
      return setTimeout(() => this.init(), 100);
    this.sessions = this.getAllSessionsFromConference(
      this.eventService.conference
    );
  }

  getAllSessionsFromConference(conference: any) {
    const sessions = [];
    for (let day of conference.days) {
      for (let room of Object.values(day.rooms)) {
        for (let session of room as any[]) {
          sessions.push(session);
        }
      }
    }

    return sessions;
  }

  clickDetail(event) {
    this.presentEventDetailModal({ event: event });
  }

  presentEventDetailModal(data) {
    let profileModal = this.modalCtrl.create(EventDetailPage, data);
    profileModal.present();
  }

  getItems(ev) {
    // Reset items back to all of the items
    this.init();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.sessions = this.sessions.filter((item) => {
        return item.title.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }
}