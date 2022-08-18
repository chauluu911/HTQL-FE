export interface IMeetingRequest {
    keyword?: string;
    title?: string;
    roomId?: string;
    repeatType?: string;
    startAt?: number;
    endDate?: string;
    meetingStatus?: string;
    pageIndex?: number;
    pageSize?: number;
    hasPageable?: boolean;
    sortBy?: string;
}

export class MeetingRequest implements IMeetingRequest {
    constructor(
      public keyword?: string,
      public title?: string,
      public roomId?: string,
      public repeatType?: string,
      public startAt?: number,
      public endDate?: string,
      public meetingStatus?: string,
      public pageIndex?: number,
      public pageSize?: number,
      public hasPageable?: boolean,
      public sortBy?: string
    ) {
      this.keyword = keyword;
      this.title = title;
      this.roomId = roomId;
      this.repeatType = repeatType;
      this.startAt = startAt;
      this.endDate = endDate;
      this.meetingStatus = meetingStatus;
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
      this.hasPageable = hasPageable;
      this.sortBy = sortBy;
    }
}
