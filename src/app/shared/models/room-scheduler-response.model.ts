export interface IRoomSchedulerResponse {
    id?: string;
    meetingId?: string;
    roomId?: string;
    organizerId?: string;
    organizerName?: string;
    title?: string;
    startAt?: number;
    finishAt?: number;
}

export class RoomSchedulerResponse implements IRoomSchedulerResponse {
    constructor(
      public id?: string,
      public meetingId?: string,
      public roomId?: string,
      public organizerId?: string,
      public organizerName?: string,
      public title?: string,
      public startAt?: number,
      public finishAt?: number
    ) {
      this.id = id;
      this.meetingId = meetingId;
      this.roomId = roomId;
      this.organizerId = organizerId;
      this.organizerName = organizerName;
      this.title = title;
      this.startAt = startAt;
      this.finishAt = finishAt;
    }
}
