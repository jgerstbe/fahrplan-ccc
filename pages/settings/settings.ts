import { Component } from "@angular/core";
import { ModalController, NavController } from "ionic-angular";
import { User } from "../../data/models";
import { FavoriteService } from "../../data/favorite.service";
import { FriendsPage } from "../friends/friends";

@Component({
  selector: "page-settings",
  templateUrl: "settings.html",
  styleUrls: ["settings.css"]
})
export class SettingsPage {
  fahrplan;
  friend_id: string = "";
  editUUID: boolean = false;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public favoriteService: FavoriteService
  ) {
    // this.fahrplan = fahrplan;
    // this.fahrplan.timestamp = new Date(this.fahrplan.timestamp);
  }

  ngOnInit() {}

  onAddFriend() {
    console.warn(this.friend_id);
    this.favoriteService.addFriend(this.friend_id);
    this.friend_id = "";
  }

  onDeleteFriend(id) {
    this.favoriteService.removeFriend(id);
  }

  saveUUID() {
    localStorage.setItem("fpccc_uuid", this.favoriteService.uuid);
    this.favoriteService.favorites = [];
    this.favoriteService.friends = [];
    this.favoriteService.load();
    this.editUUID = false;
  }

  openFriendsSchedule(f) {
    let modal = this.modalCtrl.create(FriendsPage, { friendUuid: f });
    modal.present();
  }
}
