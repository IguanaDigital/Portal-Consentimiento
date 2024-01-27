import { CalendarEventAction, CalendarEvent } from 'angular-calendar';
import {
  startOfDay
} from 'date-fns';

export class EgretCalendarEvent implements CalendarEvent {
  _id?: string;
  start: Date;
  end: Date ;
  title: string;
  color?: {
    primary: string;
    secondary: string;
  };
  actions?: CalendarEventAction[];
  allDay?: boolean;
  cssClass?: string;
  resizable?: {
    beforeStart?: boolean;
    afterEnd?: boolean;
  };
  draggable?: boolean;
  meta?: {
    location: string,
    notes: string
  };

  constructor(data: any) {
    const {
      _id = '',
      start = startOfDay(new Date()),
      end = new Date(),
      title = '',
      color = { primary: '#247ba0', secondary: '#D1E8FF' },
      draggable = true,
      resizable = { beforeStart: true, afterEnd: true },
      actions = [],
      allDay = false,
      cssClass = '',
      meta = { location: '', notes: '' },
    } = data;
  
    this._id = _id;
    this.start = new Date(start);
    this.end = new Date(end);
    this.title = title;
    this.color = color;
    this.draggable = draggable;
    this.resizable = resizable;
    this.actions = actions;
    this.allDay = allDay;
    this.cssClass = cssClass;
    this.meta = meta;
  }
}
