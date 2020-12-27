import { Component } from "@angular/core";
import { NavParams, ViewController } from "ionic-angular";
import { Event } from "../../data/models";
import * as tracks from "../../data/tracks.json";
import { FavoriteService } from "../../data/favorite.service";

@Component({
  selector: "page-eventDetail",
  templateUrl: "eventDetail.html",
  styleUrls: ["eventDetail.css"]
})
export class EventDetailPage {
  event: Event;
  keys: string[];
  tracks = tracks;
  streamUrl: string;
  videoWidth: number = 0;
  videoHeight: number = 0;

  constructor(
    params: NavParams,
    public viewCtrl: ViewController,
    public favoriteService: FavoriteService
  ) {
    console.log("params", params);
    this.event = params.data.event;
    this.event.date = new Date(this.event.date);
    this.keys = Object.keys(this.event);
    this.getStream(this.event.room);
  }

  getStream(room: string) {
    console.log("getStream", room);
    const calcPlayerSize = () => {
      console.log(
        "videoItem",
        document.querySelector("#videoItem")
          ? document.querySelector("#videoItem").offsetWidth
          : 0
      );
      if (!document.querySelector("#videoItem")) {
        return setTimeout(calcPlayerSize, 100);
      }
      this.videoWidth = document.querySelector("#videoItem").offsetWidth - 30;
      this.videoHeight = this.videoWidth / 1.77;
      console.log(this.videoWidth, this.videoHeight);
    };
    if (room === "rC1") {
      this.streamUrl = "https://cdn.c3voc.de/rc1_native_hd.webm";
      calcPlayerSize();
    } else if (room == "rC2") {
      this.streamUrl = "https://cdn.c3voc.de/rc2_native_hd.webm";
      calcPlayerSize();
    } else {
      delete this.streamUrl;
    }
  }
}
