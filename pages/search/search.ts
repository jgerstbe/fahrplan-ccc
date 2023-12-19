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
}
