import { IRoomScheduler } from './room-scheduler.model';

export interface IRoom {
    id?: string;
    code?: string;
    name?: string;
    location?: string;
    createdAt?: number;
    createdBy?: string;
    lastModifiedAt?: number;
    lastModifiedBy?: string;
    status?: string;
    roomSchedulers?: IRoomScheduler[];
}

export class Room implements IRoom {
    constructor(
      public id?: string,
      public code?: string,
      public name?: string,
      public location?: string,
      public createdAt?: number,
      public createdBy?: string,
      public lastModifiedAt?: number,
      public lastModifiedBy?: string,
      public status?: string,
      public roomSchedulers?: IRoomScheduler[]
    ) {
      this.id = id;
      this.code = code;
      this.name = name;
      this.location = location;
      this.createdAt = createdAt;
      this.createdBy = createdBy;
      this.lastModifiedAt = lastModifiedAt;
      this.lastModifiedBy = lastModifiedBy;
      this.status = status;
      this.roomSchedulers = roomSchedulers;
    }
}
