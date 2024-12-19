import { Injectable } from '@angular/core';
import { Day } from ' ./models';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  public daysWithSessionsByTime: Day[] = [];
  public tracks = {};
  public conference;
  public version;
  public onSchedule: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    this.initService();
  }

  initService() {
    const congressUrl =
      'https://fahrplan.events.ccc.de/congress/2024/fahrplan/schedule/export/schedule.json';
    this.http.get(congressUrl).subscribe(
      (data: any) => {
        this.conference = data.schedule.conference;
        this.tracks = this.parseTracks(data);
        this.daysWithSessionsByTime = this.parseDaysBySessionTime(data);
        this.onSchedule.next(data);
        this.version = {
          baseUrl: data.schedule.base_url,
          timestamp: data.schedule.version,
        };
      },
      (error) => {
        console.error('Could not load schedule.', error);
      }
    );
  }

  parseTracks(fahrplan: any) {
    const tracks = {};
    fahrplan.schedule.conference.tracks.forEach((t) => {
      tracks[t.name] = t.color;
    });
    return tracks ?? {};
  }

  /**
   * Parse days with session information by rooms.
   */
  parseDaysBySessionTime(fahrplan: any) {
    const local_days: Day[] = [];
    fahrplan.schedule.conference.days.forEach((day) => {
      const parsedDay = new Day(
        day.index,
        day.date,
        day.day_start,
        day.day_end,
        day.rooms
      );
      // merge rooms into a single list
      // let allRooms = parsedDay.rooms.Adams.concat(parsedDay.rooms.Borg, parsedDay.rooms.Clarke, parsedDay.rooms.Dijkstra, parsedDay.rooms.Eliza);
      let allRooms = [];
      Object.keys(parsedDay.rooms).map((key: string) =>
        allRooms.push(...Object.values(parsedDay.rooms[key]))
      );
      // sort rooms
      allRooms.sort(function (a, b) {
        const startA = Number(a.start.replace(':', ''));
        const startB = Number(b.start.replace(':', ''));
        // const startA = new Date(a.date);
        // const startB = new Date(b.date);
        // const startA = a.date;
        // const startB = b.date;
        // compare
        if (startA > startB) {
          return 1;
        }
        if (startA < startB) {
          return -1;
        }
        if (startA === startB) {
          const durA = Number(a.duration.replace(':', ''));
          const durB = Number(b.duration.replace(':', ''));
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
    start = start.split(':');
    duration = duration.split(':');
    const startHour: number = Number(start[0]),
      startMinutes: number = Number(start[1]),
      durationHour: number = Number(duration[0]),
      durationMinutes: number = Number(duration[1]);
    let h: number = 0,
      m: number = 0;

    h = startHour + durationHour;
    m = startMinutes + durationMinutes;

    if (m >= 60) {
      h += (m - (m % 60)) / 60;
      m = m % 60;
    }

    if (h >= 24) {
      h -= 24;
    }

    if ((m + '').length === 1) {
      return h + ':0' + m;
    } else {
      return h + ':' + m;
    }
  }
}
