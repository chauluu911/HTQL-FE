export interface IRoomSchedulerRequest {
    startAt?: number;
    finishAt?: number;
}

export class RoomSchedulerRequest implements IRoomSchedulerRequest {
    constructor(
      public startAt?: number,
      public finishAt?: number,
    ) {
      this.startAt = startAt;
      this.finishAt = finishAt;
    }
}
