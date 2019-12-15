import { Component } from '@angular/core';

import { EventPage } from '../event/event';
import { SettingsPage } from '../settings/settings';
import { CalendarPage } from '../calendar/calendar';
import { FavoritesPage } from '../favorites/favorites';
import { FriendsPage } from '../friends/friends';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CalendarPage;
  tab2Root = EventPage;
  tab4Root = FavoritesPage;
  tab5Root = FriendsPage;
  tab3Root = SettingsPage;

  constructor() {

  }
}
