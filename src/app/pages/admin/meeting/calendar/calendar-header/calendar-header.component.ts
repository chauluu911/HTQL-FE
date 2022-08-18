import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CALENDAR_TYPE } from '@shared/constants/meeting.constants';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss']
})
export class CalendarHeaderComponent implements OnInit {

  @Input() view!: CalendarView;

  @Input() viewDate!: Date;

  @Input() locale = 'en';

  @Output() viewChange = new EventEmitter<CalendarView>();

  @Output() viewDateChange = new EventEmitter<Date>();

  CalendarView = CalendarView;

  calendarType = CALENDAR_TYPE;

  constructor() { }

  ngOnInit(): void {
  }

  onChange(newValue: any) {
    this.viewChange.emit(newValue);
  }

  onPreviousCalendar(viewDate: any) {

  }
}
