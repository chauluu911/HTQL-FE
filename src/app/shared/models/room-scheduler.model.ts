export interface IRoomScheduler {
  id?: string;
  meetingId?: string;
  roomId?: string;
  startAt?: number;
  finishAt?: number;
}

export class RoomScheduler implements IRoomScheduler {
  constructor(
    public id?: string,
    public meetingId?: string,
    public roomId?: string,
    public startAt?: number,
    public finishAt?: number
  ) {
    this.id = id;
    this.meetingId = meetingId;
    this.roomId = roomId;
    this.startAt = startAt;
    this.finishAt = finishAt;
  }
}
