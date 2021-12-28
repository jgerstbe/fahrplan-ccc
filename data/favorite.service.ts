import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  jsonbox: string = 'https://krat.es/c89a335db8a4ed59ad52';
  favLocator: string = 'fpccc_favorites_2021';
  public favorites: string[] = [];
  public friends: string[] = [];
  public localFriends: Map<string, string> = new Map();
  public friendsNicks: Map<string, string> = new Map();
  public uuid: string = '';
  public nickname: string = '';

  constructor(private http: HttpClient) {
    this.load();
  }

  public isFavorite(guid) {
    if (this.favorites && guid) {
      const index = this.favorites.indexOf(guid);
      if (index != -1) {
        return 'star';
      }
    }
    return 'star-outline';
  }

  toggle(guid) {
    const index = this.favorites.indexOf(guid);
    console.log(guid + ' is ' + index);
    if (index != -1) {
      this.favorites.splice(index, 1);
    } else if (index === -1) {
      this.favorites.push(guid);
    }
    this.save();
  }

  load() {
    const loadLocal = () => {
      let local = localStorage.getItem(this.favLocator);
      if (local === null) {
        return;
      }
      this.favorites = JSON.parse(local);
    };
    // api
    if (true) {
      const uuid = localStorage.getItem('fpccc_uuid');
      if (uuid !== null) {
        this.uuid = uuid;
        this.http.get(this.jsonbox + uuid).subscribe(
          (data: any) => {
            console.log('LOAD', data);
            this.nickname = data.nickname ? data.nickname : 'Anon_' + uuid;
            this.favorites =
              data.favorites && data.favorites.length > 0 ? data.favorites : [];
            this.friends =
              data.friends && data.friends.length > 0 ? data.friends : [];
            this.friendsNicks =
              data.friendsNicks && data.friendsNicks.length > 0
                ? new Map(data.friendsNicks)
                : new Map();
            // load friends data
            this.loadAllFriends().subscribe(
              (data) => {},
              (error) => console.error('loadAllFriends', error)
            );
          },
          (error) => {
            console.error('Could not load data.', error);
            loadLocal();
          }
        );
      } else {
        console.warn('HAD NO SYNC ACC');
        this.save();
      }
    } else {
      loadLocal();
    }
  }

  save() {
    console.log('favorites', this.favorites);
    localStorage.setItem(this.favLocator, JSON.stringify(this.favorites));
    if (this.uuid !== null) {
      localStorage.setItem('fpccc_uuid', this.uuid);
    }
    // save to api
    if (true) {
      const uuid =
        this.uuid && this.uuid.length > 0
          ? this.uuid
          : localStorage.getItem('fpccc_uuid') &&
            localStorage.getItem('fpccc_uuid').length > 0
          ? localStorage.getItem('fpccc_uuid')
          : null;
      const data = {
        nickname: this.nickname
          ? this.nickname
          : 'Anon' + (uuid ? '_' + uuid : ''),
        favorites: this.favorites,
        friends: this.friends,
        friendsNicks: this.friendsNicks,
      };
      const createEntry = () => {
        this.http.post(this.jsonbox, data).subscribe(
          (data: any) => {
            console.log('CREATE + SAVE', data);
            localStorage.setItem('fpccc_uuid', data._id);
            this.uuid = data._id;
            this.nickname = data.nickname;
          },
          (error) => console.error('Could not save data.', error)
        );
      };
      if (uuid !== null) {
        this.http.put(this.jsonbox + uuid, data).subscribe(
          (data) => console.log('SAVE', data),
          (error) => {
            console.error('Could not save data.', error);
            // try posting if it is an old user id
            createEntry();
          }
        );
      } else {
        createEntry();
      }
    }
  }

  addFriend(uuid: string) {
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

  loadFriendsFavorites(friendsUuid: string) {
    return this.http.get(this.jsonbox + friendsUuid).pipe(
      tap((friend: any) => {
        this.friendsNicks.set(friend._id, friend.nickname);
        this.localFriends.set(friend._id, friend);
      })
    );
  }

  loadAllFriends() {
    const obs = this.friends.map((f: any) => this.loadFriendsFavorites(f));
    return forkJoin(obs);
  }

  friendsInSession(sessId: string) {
    let nameList = [];
    this.localFriends.forEach((friend: any) => {
      if (friend.favorites.indexOf(sessId) !== -1) {
        nameList.push(friend.nickname);
      }
    });
    return nameList.join(', ');
  }
}
