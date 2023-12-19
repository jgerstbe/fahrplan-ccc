import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { EventPage } from '../pages/event/event';
import { EventDetailPage } from '../pages/eventDetail/eventDetail';
import { SettingsPage } from '../pages/settings/settings';
import { CalendarPage } from '../pages/calendar/calendar';
import { TabsPage } from '../pages/tabs/tabs';
import { FavoritesPage } from '../pages/favorites/favorites';
import { FriendsPage } from '../pages/friends/friends';
import { SearchPage } from '../pages/search/search';

@NgModule({
  declarations: [
    MyApp,
    EventPage,
    EventDetailPage,
    FavoritesPage,
    FriendsPage,
    SettingsPage,
    CalendarPage,
    TabsPage,
    SearchPage,
  ],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(MyApp)],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EventPage,
    EventDetailPage,
    FavoritesPage,
    FriendsPage,
    SettingsPage,
    CalendarPage,
    TabsPage,
    SearchPage,
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }],
})
export class AppModule {}
