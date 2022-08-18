import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MeetingCalendarModule } from './calendar/meeting-calendar.module';
import { DetailMeetingListComponent } from './meeting-list/detail-meeting-list/detail-meeting-list.component';
import { MeetingListComponent } from './meeting-list/meeting-list.component';
import { MeetingUpdateComponent } from './meeting-list/meeting-update/meeting-update.component';
import { MeetingRoutingModule } from './meeting-routing.module';
import { RoomUpdateComponent } from './room/room-update/room-update.component';
import { RoomComponent } from './room/room.component';

@NgModule({
  declarations: [RoomComponent, RoomUpdateComponent,
                MeetingUpdateComponent, MeetingListComponent, DetailMeetingListComponent],
  imports: [
    CommonModule,
    SharedModule,
    MeetingRoutingModule,
    MeetingCalendarModule,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MeetingModule {
}
