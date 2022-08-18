export interface IUserScheduler {
  id?: string;
  userId?: string;
  meetingId?: string;
  roomId?: string;
  link?: string;
  meetingType?: string;
  attendeeType?: string;
  startAt?: number;
  finishAt?: number;
}

export class UserScheduler implements IUserScheduler {
    constructor(
      public id?: string,
      public userId?: string,
      public meetingId?: string,
      public roomId?: string,
      public link?: string,
      public meetingType?: string,
      public attendeeType?: string,
      public startAt?: number,
      public finishAt?: number
    ) {
      this.id = id;
      this.userId = userId;
      this.meetingId = meetingId;
      this.roomId = roomId;
      this.link = link;
      this.meetingType = meetingType;
      this.attendeeType = attendeeType;
      this.startAt = startAt;
      this.finishAt = finishAt;
    }
  }
