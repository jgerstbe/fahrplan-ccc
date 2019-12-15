import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  jsonbox:string = 'https://jsonbox.io/box_8d91a03c191deec9b3b0/';
  public favorites: string[] = [];
  public friends: string[] = [];
  public uuid:string = '';

  constructor(
    private http: HttpClient,
  ) {
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
    const loadLocal = () => {        
      let local = localStorage.getItem('favorites');
      this.favorites = JSON.parse(local);
    }
    // api 
    if (true) {
      const uuid = localStorage.getItem('fpccc_uuid');
      if (uuid !== null) {
        this.uuid = uuid;
        this.http.get(this.jsonbox+uuid).subscribe(
          (data:any) =>  {
            console.log('LOAD', data)
            this.favorites = data.favorites && data.favorites.length > 0 ? data.favorites : [];
            this.friends = data.friends && data.friends.length > 0 ? data.friends : [];
          },
          (error) => {
            console.error('Could not load data.', error);
            loadLocal();
          }
        )
      }
    } else {
      loadLocal();
    }
  }

  save() {
    console.log('favorites', this.favorites);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    // TODO save to api
    if (true) {
      const uuid = localStorage.getItem('fpccc_uuid');
      const data = {
        favorites: this.favorites,
        friends: this.friends,
      };
      if (uuid !== null) {
        this.http.put(this.jsonbox+uuid, data).subscribe(
          (data) => console.log('SAVE', data),
          (error) => console.error('Could not save data.', error)
        )
      } else {
        this.http.post(this.jsonbox, data).subscribe(
          (data:any) => {
            console.log('SAVE', data);
            localStorage.setItem('fpccc_uuid', data._id)
          },
          (error) => console.error('Could not save data.', error)
        )
      }
    }
  }

  addFriend(uuid:string) {
    const index = this.friends.indexOf(uuid);
    if (index === -1) {
      this.friends.push(uuid);
      this.save();
    }
  }

  removeFriend(uuid: string) {
    const index = this.friends.indexOf(uuid);
    if (index !== -1) {
      this.friends.splice(index, 1);
      this.save();
    }
  }

}