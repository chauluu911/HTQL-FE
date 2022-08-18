export interface IUserSchedulerRequest {
    startAt?: number;
    finishAt?: number;
}

export class UserSchedulerRequest implements IUserSchedulerRequest {
    constructor(
      public startAt?: number,
      public finishAt?: number,
    ) {
      this.startAt = startAt;
      this.finishAt = finishAt;
    }
}
