export class Day {
  index: number;
  date: Date;
  day_start: Date;
  day_end: Date;
  rooms: any[];
  roomList: string[];

  constructor(
    index: number,
    date: string,
    day_start: string,
    day_end: string,
    rooms: any
  ) {
    this.index = index;
    this.date = new Date(date);
    this.day_start = new Date(day_start);
    this.day_end = new Date(day_end);
    this.rooms = rooms;
    this.roomList = Object.keys(rooms);
  }
}

export class Event {
  url: string;
  id: number;
  guid: string;
  logo: null;
  date: Date;
  start: string;
  duration: string;
  room: string;
  slug: string;
  title: string;
  subtitle: string;
  track: string;
  type: string;
  language: string;
  abstract: string;
  description: string;
  recording_license: string;
  do_not_record: boolean;
  persons: any[];
  links: string[];
  attachments: any[];
}

export class User {
  uuid: string;
  name: string;

  constructor(uuid: string, name: string) {
    this.uuid = uuid;
    this.name = name;
  }
}
