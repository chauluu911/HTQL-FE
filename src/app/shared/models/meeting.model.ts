import { IMeetingAttendee } from './meeting-attendee.model';

export interface IMeeting {
    id?: string;
    title?: string;
    description?: string;
    roomId?: string;
    organizerId?: string;
    presiderId?: string;
    startAt?: number;
    finishAt?: number;
    endDate?: string;
    repeatType?: string;
    repeatMeasure?: number;
    dayOfWeekList?: string[];
    dayOfMonth?: number;
    weekOfMonth?: string;
    monthOfYear?: string;
    meetingAttendees?: IMeetingAttendee[];
    meetingType?: string;
    approveStatus?: string;
    meetingStatus?: string;
    link?: string;
}

export class Meeting implements IMeeting {
    constructor(
        public id?: string,
        public title?: string,
        public description?: string,
        public roomId?: string,
        public organizerId?: string,
        public presiderId?: string,
        public startAt?: number,
        public finishAt?: number,
        public endDate?: string,
        public repeatType?: string,
        public repeatMeasure?: number,
        public dayOfWeekList?: string[],
        public dayOfMonth?: number,
        public weekOfMonth?: string,
        public monthOfYear?: string,
        public invalidUserIds?: string[],
        public meetingType?: string,
        public link?: string,
        public approveStatus?: string,
        public meetingStatus?: string
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.roomId = roomId;
        this.organizerId = organizerId;
        this.presiderId = presiderId;
        this.startAt = startAt;
        this.finishAt = finishAt;
        this.endDate = endDate;
        this.repeatType = repeatType;
        this.repeatMeasure = repeatMeasure;
        this.dayOfWeekList = dayOfWeekList;
        this.dayOfMonth = dayOfMonth;
        this.weekOfMonth = weekOfMonth;
        this.monthOfYear = monthOfYear;
        this.invalidUserIds = invalidUserIds;
        this.meetingType = meetingType;
        this.link = link;
        this.approveStatus = approveStatus;
        this.meetingStatus = meetingStatus;
    }
  }


