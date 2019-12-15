import { Injectable } from '@angular/core';
import { Day } from ' ./models';
import * as tracks from './tracks.json';
import * as fahrplan from './36c3.json';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  public daysWithSessionsByTime: Day[] = [];
  public tracks = tracks;
  public conference;

  constructor() {
    this.conference = fahrplan.schedule.conference;
    this.daysWithSessionsByTime = this.parseDaysBySessionTime(fahrplan);
  }

  /**
   * Parse days with session information by rooms.
   */
  parseDaysBySessionTime(fahrplan:any) {
    const local_days: Day[] = [];
    fahrplan.schedule.conference.days.forEach(day => {
      const parsedDay = new Day(day.index, day.date, day.day_start, day.day_end, day.rooms);
      // merge rooms into a single list
      let allRooms = parsedDay.rooms.Adams.concat(parsedDay.rooms.Borg, parsedDay.rooms.Clarke, parsedDay.rooms.Dijkstra, parsedDay.rooms.Eliza);
      // sort rooms
      allRooms.sort(function(a, b) {
        // const startA = Number(a.start.replace(":", ""));
        // const startB = Number(b.start.replace(":", ""));
        // const startA = new Date(a.date);
        // const startB = new Date(b.date);
        const startA = a.date;
        const startB = b.date;
        // compare
        if (startA > startB) {
          return 1;
        }
        if (startA < startB) {
          return -1;
        }
        if (startA === startB) {
          const durA = Number(a.duration.replace(":", ""));
          const durB = Number(b.duration.replace(":", ""));
          if (durA > durB) {
            return 1;
          }
          if (durA < durB) {
            return -1;
          }
          return 0;
        }
        return 0;
      });
      // push
      parsedDay.rooms = allRooms;
      local_days.push(parsedDay);
    });
    return local_days;
  }

  /**
   * Calculat a sessions end time.
   */
  calcEnd(start, duration) {
    start = start.split(":");
    duration = duration.split(":");
    const startHour: number = Number(start[0]),
      startMinutes: number = Number(start[1]),
      durationHour: number = Number(duration[0]),
      durationMinutes: number = Number(duration[1]);
    let h: number = 0,
      m: number = 0;

    h = startHour + durationHour;
    m = startMinutes + durationMinutes;

    if (m > 60) {
      h += (m - m % 60) / 60;
      m = m % 60;
    }

    if (h >= 24) {
      h -= 24;
    }

    return h + ":" + m;
  }

}
