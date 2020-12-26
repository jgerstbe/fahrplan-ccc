import { Component } from "@angular/core";
import { ModalController, NavController } from "ionic-angular";
import { EventDetailPage } from "../eventDetail/eventDetail";
import { Day } from " ../../data/models";
import { FavoriteService } from "../../data/favorite.service";
import { EventService } from "../../data/event.service";

@Component({
  selector: "page-calendar",
  templateUrl: "calendar.html"
})
export class CalendarPage {
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public favoriteService: FavoriteService,
    public eventService: EventService
  ) {}

  days: Day[] = [];
  tracks;
  activeDay: number = 0;

  ngOnInit() {
    // subsscribe to schedule update
    this.eventService.onSchedule.asObservable().subscribe(data => {
      this.parseSchedule();
    });
  }

  parseSchedule() {
    this.days = this.eventService.daysWithSessionsByTime;
    this.tracks = this.eventService.tracks;

    // mark active day if today is a congress day
    const today = new Date().toISOString().split("T")[0];
    const isToday = this.days.filter(
      d => d.date.toISOString().split("T")[0] === today
    );
    console.log("activeDay is today", isToday.length > 0 ? true : false);
    this.activeDay = isToday.length > 0 ? isToday[0].index - 1 : this.activeDay;
  }

  clickDetail(event) {
    this.presentEventDetailModal({ event: event });
  }

  presentEventDetailModal(data) {
    let profileModal = this.modalCtrl.create(EventDetailPage, data);
    profileModal.present();
  }
}
