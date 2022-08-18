import { CalendarView } from 'angular-calendar';

export const NOT_REPEAT = 'NOT_REPEAT';
export const DAILY_REPEAT = 'DAILY';
export const WEEKLY_REPEAT = 'WEEKLY';
export const MONTHLY_REPEAT = 'MONTHLY';
export const YEARLY_REPEAT = 'YEARLY';
export const FIRST_OPTION =  'FIRST_OPTION';
export const SECOND_OPTION = 'SECOND_OPTION';
export const OFFLINE = 'OFFLINE';
export const ONLINE = 'ONLINE';
export const UNCONFIRMED = 'UNCONFIRMED';
export const APPROVED = 'APPROVED';
export const REJECTED = 'REJECTED';
export const MIN_MEETING_HOUR = 8;
export const MAX_MEETING_HOUR = 20;
export const DEFAULT_MEASURE = 1;
export const DEFAULT_WEEK_OF_MONTH = 'FIRST';
export const DEFAULT_DURATION_TIME = 15;
export const END_DATE_FORMAT = 'YYYY-MM-DD';
export const DEFAULT_DATE_FORMAT = 'DD/MM/yyyy';
export const MEETING_ACTIVE = 'ACTIVE';
export const MEETING_CANCELED = 'CANCELED';

export const REPEAT_TYPE = [
    {value: NOT_REPEAT, label: 'model.meeting.service.repeatType.not-repeat'},
    {value: DAILY_REPEAT, label: 'model.meeting.service.repeatType.daily'},
    {value: WEEKLY_REPEAT, label: 'model.meeting.service.repeatType.weekly'},
    {value: MONTHLY_REPEAT, label: 'model.meeting.service.repeatType.monthly'},
    {value: YEARLY_REPEAT, label: 'model.meeting.service.repeatType.yearly'},
];

export const REPEAT_TYPES = {
    NOT_REPEAT,
    DAILY_REPEAT,
    WEEKLY_REPEAT,
    MONTHLY_REPEAT,
    YEARLY_REPEAT
};

export const SELECT_OPTIONS = {
    FIRST_OPTION,
    SECOND_OPTION
};

export const MONTH_OF_YEAR = [
    {value: 'JANUARY', numberValue: 1, label: 'model.meeting.service.monthOfYear.jan'},
    {value: 'FEBRUARY', numberValue: 2, label: 'model.meeting.service.monthOfYear.feb'},
    {value: 'MARCH', numberValue: 3, label: 'model.meeting.service.monthOfYear.mar'},
    {value: 'APRIL', numberValue: 4, label: 'model.meeting.service.monthOfYear.apr'},
    {value: 'MAY', numberValue: 5, label: 'model.meeting.service.monthOfYear.may'},
    {value: 'JUNE', numberValue: 6, label: 'model.meeting.service.monthOfYear.jun'},
    {value: 'JULY', numberValue: 7, label: 'model.meeting.service.monthOfYear.jul'},
    {value: 'AUGUST', numberValue: 8, label: 'model.meeting.service.monthOfYear.aug'},
    {value: 'SEPTEMBER', numberValue: 9, label: 'model.meeting.service.monthOfYear.sep'},
    {value: 'OCTOBER', numberValue: 10, label: 'model.meeting.service.monthOfYear.oct'},
    {value: 'NOVEMBER', numberValue: 11, label: 'model.meeting.service.monthOfYear.nov'},
    {value: 'DECEMBER', numberValue: 12, label: 'model.meeting.service.monthOfYear.dec'},
];

export const WEEK_OF_MONTH = [
    {value: 'FIRST', numberValue: 1, label: 'model.meeting.service.weekOfMonth.first'},
    {value: 'SECOND', numberValue: 2, label: 'model.meeting.service.weekOfMonth.second'},
    {value: 'THIRD', numberValue: 3, label: 'model.meeting.service.weekOfMonth.third'},
    {value: 'FOURTH', numberValue: 4, label: 'model.meeting.service.weekOfMonth.fourth'},
    {value: 'LAST', numberValue: 5, label: 'model.meeting.service.weekOfMonth.last'},
];

export const DAY_OF_WEEK = [
    {value: 'MONDAY', numberValue: 1, label: 'model.meeting.service.dayOfWeek.mo'},
    {value: 'TUESDAY', numberValue: 2, label: 'model.meeting.service.dayOfWeek.tu'},
    {value: 'WEDNESDAY', numberValue: 3, label: 'model.meeting.service.dayOfWeek.we'},
    {value: 'THURSDAY', numberValue: 4, label: 'model.meeting.service.dayOfWeek.th'},
    {value: 'FRIDAY', numberValue: 5, label: 'model.meeting.service.dayOfWeek.fr'},
    {value: 'SATURDAY', numberValue: 6, label: 'model.meeting.service.dayOfWeek.sa'},
    {value: 'SUNDAY', numberValue: 7, label: 'model.meeting.service.dayOfWeek.su'},
];

export const WEEK_OPTION = [
    { label: 'Mo', value: 'MONDAY', numberValue: 1, checked: true, disabled: true},
    { label: 'Tu', value: 'TUESDAY', numberValue: 2, checked: false, disabled: false},
    { label: 'We', value: 'WEDNESDAY', numberValue: 3, checked: false, disabled: false },
    { label: 'Th', value: 'THURSDAY', numberValue: 4, checked: false, disabled: false },
    { label: 'Fr', value: 'FRIDAY', numberValue: 5, checked: false, disabled: false },
    { label: 'Sa', value: 'SATURDAY', numberValue: 6, checked: false, disabled: false },
    { label: 'Su', value: 'SUNDAY', numberValue: 7, checked: false, disabled: false },
];

export const CALENDAR_TYPE = [
    {value: CalendarView.Day, label: 'model.meeting.service.calenderType.day'},
    {value: CalendarView.Week, label: 'model.meeting.service.calenderType.week'},
    {value: CalendarView.Month, label: 'model.meeting.service.calenderType.month'},
];

export const MEETING_TYPE = [
    {value: OFFLINE, label: 'model.meeting.service.meetingType.offline'},
    {value: ONLINE, label: 'model.meeting.service.meetingType.online'},
];

export const MEETING_TYPES = {
    OFFLINE,
    ONLINE
};

export const APPROVE_STATUS = [
    {value: UNCONFIRMED, label: 'model.meeting.service.approveStatus.unconfirmed'},
    {value: APPROVED, label: 'model.meeting.service.approveStatus.approved'},
    {value: REJECTED, label: 'model.meeting.service.approveStatus.rejected'},
];

export const APPROVE_STATUSS = {
    UNCONFIRMED,
    APPROVED,
    REJECTED
};

export const MEETING_STATUS = [
    {value: MEETING_ACTIVE, label: 'model.meeting.service.meetingStatus.active'},
    {value: MEETING_CANCELED, label: 'model.meeting.service.meetingStatus.canceled'},
];

export const MEETING_STATUSS = {
    MEETING_ACTIVE,
    MEETING_CANCELED
};

