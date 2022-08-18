import { IMeetingAttendeeResponse } from './request/meeting-attendee-response.model';
import { IRoom } from './room.model';

export interface IUserSchedulerResponse {
    id?: string;
    userId?: string;
    meetingId?: string;
    room?: IRoom;
    title?: string;
    link?: string;
    organizerName?: string;
    meetingAttendees?: IMeetingAttendeeResponse[];
    meetingType?: string;
    attendeeType?: string;
    approveStatus?: string;
    startAt?: number;
    finishAt?: number;
}

export class UserSchedulerResponse implements IUserSchedulerResponse {
    constructor(
      public id?: string,
      public userId?: string,
      public meetingId?: string,
      public room?: IRoom,
      public title?: string,
      public link?: string,
      public organizerName?: string,
      public meetingAttendees?: IMeetingAttendeeResponse[],
      public meetingType?: string,
      public attendeeType?: string,
      public approveStatus?: string,
      public startAt?: number,
      public finishAt?: number
    ) {
      this.id = id;
      this.userId = userId;
      this.meetingId = meetingId;
      this.room = room;
      this.title = title;
      this.link = link;
      this.organizerName = organizerName;
      this.meetingAttendees = meetingAttendees;
      this.meetingType = meetingType;
      this.attendeeType = attendeeType;
      this.approveStatus = approveStatus;
      this.startAt = startAt;
      this.finishAt = finishAt;
    }
}
