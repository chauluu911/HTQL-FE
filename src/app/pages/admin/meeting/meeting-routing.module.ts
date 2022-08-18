import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTER_ACTIONS, ROUTER_UTILS } from '@shared/utils/router.utils';
import { CalendarComponent } from './calendar/calendar.component';
import { RoomCalendarComponent } from './calendar/room-calendar/room-calendar.component';
import { DetailMeetingListComponent } from './meeting-list/detail-meeting-list/detail-meeting-list.component';
import { MeetingListComponent } from './meeting-list/meeting-list.component';
import { MeetingUpdateComponent } from './meeting-list/meeting-update/meeting-update.component';
import { RoomComponent } from './room/room.component';

const routes: Routes = [
  {
    path: ROUTER_UTILS.meeting.calender,
    component: CalendarComponent,
    data: {
      title: 'model.meeting.calendar.title',
    },
  },
  {
    path: ROUTER_UTILS.room.roomCalendar,
    component: RoomCalendarComponent,
    data: {
      title: 'model.meeting.roomCalendar.title',
    },
  },
  {
    path: ROUTER_UTILS.meeting.list,
    component: MeetingListComponent,
    data: {
      title: 'model.meeting.management',
    },
  },
  {
    path: ROUTER_UTILS.meeting.create,
    component: MeetingUpdateComponent,
    data: {
      title: 'model.meeting.management',
      action: ROUTER_ACTIONS.create,
    },
  },
  {
    path: ROUTER_UTILS.meeting.update,
    component: MeetingUpdateComponent,
    data: {
      title: 'model.meeting.management',
      action: ROUTER_ACTIONS.update,
    },
  },
  {
    path: ROUTER_UTILS.meeting.detail,
    component: DetailMeetingListComponent,
    data: {
      title: 'model.meeting.management',
      action: ROUTER_ACTIONS.detail,
    },
  },
  {
    path: ROUTER_UTILS.room.root,
    component: RoomComponent,
    data: {
      title: 'model.room.title',
    },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetingRoutingModule {}
