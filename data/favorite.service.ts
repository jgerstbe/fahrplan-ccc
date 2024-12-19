import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concatMap, delay, tap, toArray } from 'rxjs/operators';
import { forkJoin, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  pantryId: string = '239bdd07-b98c-4a0d-ba14-ced318b54fdd';
  jsonbox: string =
    'https://getpantry.cloud/apiv1/pantry/' + this.pantryId + '/';
  favLocator: string = 'fpccc_favorites_2024';
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
        this.http.get(this.jsonbox + 'basket/' + uuid).subscribe(
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
    if (this.uuid) {
      localStorage.setItem('fpccc_uuid', this.uuid);
    }
    // save to api
    if (!this.favorites.length) return;
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
    if (uuid) {
      // this.http.put(this.jsonbox + 'basket/' + uuid, data).subscribe(
      //   (data) => console.log('SAVE', data),
      //   (error) => {
      //     console.error('Could not save data.', error);
      //     // try posting if it is an old user id
      //     this.createEntry(uuid, data);
      //   }
      // );
      this.createEntry(uuid, data);
    } else {
      this.createEntry(this.uid(), data);
    }
  }

  uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  createEntry(uuid: string, data: any) {
    fetch(this.jsonbox + 'basket/' + uuid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((response) => {
        console.log('CREATE + SAVE', response);
        localStorage.setItem('fpccc_uuid', uuid);
        this.uuid = uuid;
        this.nickname = data?.nickname;
      })
      .catch((error) => console.error('Could not save data.', error));
  }

  addFriend(uuid: string) {
    const index = this.friends.indexOf(uuid);
    if (index === -1) {
      this.friends.push(uuid);
      this.save();
      // set timeout because of api limits
      setTimeout(() => this.loadFriendsFavorites(uuid).subscribe(), 1100);
    }
  }

  removeFriend(uuid: string) {
    const index = this.friends.indexOf(uuid);
    if (index !== -1) {
      this.friends.splice(index, 1);
      this.save();
    }
    this.localFriends.delete(uuid);
  }

  loadFriendsFavorites(friendsUuid: string) {
    return this.http.get(this.jsonbox + 'basket/' + friendsUuid).pipe(
      tap((friend: any) => {
        this.friendsNicks.set(friendsUuid, friend.nickname);
        this.localFriends.set(friendsUuid, friend);
      })
    );
  }

  // loadAllFriends() {
  //   const obs = this.friends.map((f: any) => this.loadFriendsFavorites(f));
  //   return forkJoin(obs);
  // }
  loadAllFriends() {
    // use delay because of api limits
    const obs = from(this.friends).pipe(
      concatMap((f) => this.loadFriendsFavorites(f).pipe(delay(1200)))
    );
    return obs.pipe(toArray());
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
