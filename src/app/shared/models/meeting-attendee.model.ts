export interface IMeetingAttendee {
    id?: string;
    userId?: string
    meetingId?: string
    attendeeType?: string
}

export class MeetingAttendee implements IMeetingAttendee {
    constructor(
        public id?: string,
        public userId?: string,
        public meetingId?: string,
        public attendeeType?: string
    ) {
        this.id = id;
        this.userId = userId;
        this.meetingId = meetingId;
        this.attendeeType = attendeeType;
    }
}
