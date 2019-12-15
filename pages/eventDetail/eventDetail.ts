import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Event } from '../../data/models';
import * as tracks from '../../data/tracks.json';
import { FavoriteService } from '../../data/favorite.service';

@Component({
  selector: 'page-eventDetail',
  templateUrl: 'eventDetail.html',
  styleUrls: ['eventDetail.css']
})
export class EventDetailPage {
  event: Event;
  keys: string[];
  tracks = tracks;

   constructor(
     params: NavParams,
     public viewCtrl: ViewController,
     public favoriteService: FavoriteService,
    ) {
    console.log('params', params);
    this.event = params.data.event;
    this.event.date = new Date(this.event.date); 
    this.keys = Object.keys(this.event);
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}