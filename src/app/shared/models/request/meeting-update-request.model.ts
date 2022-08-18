export interface IMeetingUpdateRequest {
    title?: string;
    roomId?: string;
    repeatType?: string;
    meetingType?: string;
    presiderId?: string;
    link?: string;
    startAt?: number;
    finishAt?: number;
    endDate?: string;
    description?: string;
    repeatMeasure?: number;
    dayOfWeekList?: string[];
    dayOfWeek?: string;
    dayOfMonth?: number;
    weekOfMonth?: string;
    monthOfYear?: string;
    requiredUserIds?: string[];
    optionalUserIds?: string[];
}

export class MeetingUpdateRequest implements IMeetingUpdateRequest {
    constructor(
        public title?: string,
        public roomId?: string,
        public meetingType?: string,
        public link?: string,
        public repeatType?: string,
        public presiderId?: string,
        public startAt?: number,
        public finishAt?: number,
        public endDate?: string,
        public description?: string,
        public repeatMeasure?: number,
        public dayOfWeekList?: string[],
        public dayOfMonth?: number,
        public weekOfMonth?: string,
        public monthOfYear?: string,
        public requiredUserIds?: string[],
        public optionalUserIds?: string[],
    ) {
        this.title = title;
        this.roomId = roomId;
        this.meetingType = meetingType;
        this.link = link;
        this.repeatType = repeatType;
        this.presiderId = presiderId;
        this.startAt = startAt;
        this.finishAt = finishAt;
        this.endDate = endDate;
        this.description = description;
        this.repeatMeasure = repeatMeasure;
        this.dayOfWeekList = dayOfWeekList;
        this.dayOfMonth = dayOfMonth;
        this.monthOfYear = monthOfYear;
        this.weekOfMonth = weekOfMonth;
        this.requiredUserIds = requiredUserIds;
        this.optionalUserIds = optionalUserIds;
    }
  }


