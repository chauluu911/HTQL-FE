import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import {
  CalendarModule, DateAdapter
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
import { CalendarComponent } from './calendar.component';
import { RoomCalendarComponent } from './room-calendar/room-calendar.component';
import { RoomSchedulerComponent } from './room-calendar/room-scheduler/room-scheduler.component';
import { UserSchedulerComponent } from './user-scheduler/user-scheduler.component';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarHeaderComponent,
    UserSchedulerComponent,
    RoomCalendarComponent,
    RoomSchedulerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CalendarModule.forRoot(
      {
        provide: DateAdapter,
        useFactory: adapterFactory,
      }
    ),
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class MeetingCalendarModule {
}
