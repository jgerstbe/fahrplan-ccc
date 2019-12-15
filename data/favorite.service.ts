import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  favorites: string[] = [];

  constructor() {
    this.load();
  }

  public isFavorite(guid) {
    const index = this.favorites.indexOf(guid);
    if (index != -1) {
      return 'star';
    }
    return 'star-outline';
  }

  toggle(guid) {
    const index = this.favorites.indexOf(guid);
    console.log(guid+" is "+index)
    if (index != -1) {
      this.favorites.splice(index, 1);
    } else if (index === -1) {
      this.favorites.push(guid);
    }
    this.save();
  }

  load() {
    let local = localStorage.getItem('favorites');
    if (local) {
      this.favorites = JSON.parse(local);
    }
  }

  save() {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
   // TODO save to api
  }

}