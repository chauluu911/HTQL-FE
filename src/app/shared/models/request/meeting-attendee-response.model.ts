export interface IMeetingAttendeeResponse {
    userId?: string;
    fullName?: string;
    employeeCode?: string;
    attendeeType?: string;
}

export class MeetingAttendeeResponse implements IMeetingAttendeeResponse {
    constructor(
      public userId?: string,
      public fullName?: string,
      public employeeCode?: string,
      public attendeeType?: string
    ) {
      this.userId = userId;
      this.fullName = fullName;
      this.employeeCode = employeeCode;
      this.attendeeType = attendeeType;
    }
}
