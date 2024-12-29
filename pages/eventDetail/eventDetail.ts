import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Event } from '../../data/models';
import { FavoriteService } from '../../data/favorite.service';
import { EventService } from '../../data/event.service';

@Component({
  selector: 'page-eventDetail',
  templateUrl: 'eventDetail.html',
  styleUrls: ['eventDetail.css'],
})
export class EventDetailPage {
  event: Event;
  keys: string[];
  tracks = {};
  videoWidth: number = 0;
  videoHeight: number = 0;
  persons: string = '';
  hasStream: boolean = false;

  constructor(
    params: NavParams,
    public viewCtrl: ViewController,
    public favoriteService: FavoriteService,
    public eventService: EventService
  ) {
    console.log('EventDetailPage', params);
    this.event = params.data.event;
    this.event.date = new Date(this.event.date);
    this.keys = Object.keys(this.event);
    this.tracks = this.eventService.tracks;
    this.persons = this.event.persons.map((obj) => obj.public_name).join(', ');
    this.hasStream = this.checkForStream(this.event.room);
  }

  checkForStream(room: string) {
    const roomsWithStream = ['Saal 1', 'Saal ZIGZAG', 'Saal GLITCH'];
    const sessionIsLive = this.checkIfSessionIsLive(
      this.event.date,
      this.event.duration
    );
    const hasStream = sessionIsLive && roomsWithStream.includes(room);
    if (hasStream) this.calcPlayerSize();
    return hasStream;
  }

  checkIfSessionIsLive(start: Date, duration: string) {
    const now = new Date();
    const end = this.addDurationToDate(new Date(start.toISOString()), duration);
    const isLive = start <= now && now <= end;
    console.log('is session live', isLive);
    return isLive;
  }

  addDurationToDate(date: Date, duration: string) {
    // Split the duration into hours and minutes
    let parts = duration.split(':');
    let hours = parseInt(parts[0]);
    let minutes = parseInt(parts[1]);

    // Add the hours and minutes to the date
    date.setHours(date.getHours() + hours);
    date.setMinutes(date.getMinutes() + minutes + 15);

    return date;
  }

  calcPlayerSize() {
    if (!document.querySelector('#videoItem')) {
      return setTimeout(() => this.calcPlayerSize(), 500);
    }
    console.log(
      'videoItemGroup',
      document.querySelector('#videoItemGroup').offsetWidth
    );
    this.videoWidth = document.querySelector('#videoItem').offsetWidth - 30;
    this.videoHeight = this.videoWidth / 1.77;
    console.log('calcPlayerSize', this.videoWidth, this.videoHeight);
  }
}
