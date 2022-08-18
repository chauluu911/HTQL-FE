export const WAITING = 'status.waiting';
export const WAITING_VALUE = 'PENDING';
export const DONE = 'status.done';
export const DONE_VALUE = 'DONE';
export const IN_PROGRESS = 'status.inProgress';
export const IN_PROGRESS_VALUE = 'IN_PROGRESS';
export const FAILED = 'status.failed';
export const FAILED_VALUE = 'FAILED';
export const USER_NOTI_SEND_STATUS = 'USER';
export const DEPARTMENT_NOTI_SEND_STATUS = 'DEPARTMENT';
export const BOTH_NOTI_SEND_STATUS = 3;
export const NOTIFICATION = 'NOTIFICATION';
export const EMAIL = 'EMAIL';
export const TELEGRAM = 'TELEGRAM';
export const USERIDS_SELECT = 'userIds';
export const DEPARTMENTIDS_SELECT = 'departmentIds';
export const TYPES_SELECT = 'types';
export const SELECT_ALL_OPTION = 'all';
export const PAGE_SIZE_NOTI_DEFAULT = 5;

export const NOTIFICATION_STATUS = [
  {
    label: DONE,
    value: DONE_VALUE,
  },
  {
    label: WAITING,
    value: WAITING_VALUE,
  },
  {
    label: FAILED,
    value: FAILED_VALUE,
  },
  {
    label: IN_PROGRESS,
    value: IN_PROGRESS_VALUE,
  },
];

export const NOTIFICATION_STATUS_ALL = {
  WAITING,
  WAITING_VALUE,
  DONE,
  DONE_VALUE,
  IN_PROGRESS,
  IN_PROGRESS_VALUE,
  FAILED,
  FAILED_VALUE,
};

export const NOTIFICATION_SEND_STATUS = [
  { value: USER_NOTI_SEND_STATUS, label: 'model.notification.typeSend.user' }, // gửi theo người dùng
  {
    value: DEPARTMENT_NOTI_SEND_STATUS,
    label: 'model.notification.typeSend.department',
  }, // gửi theo phòng ban
  // { value: BOTH_NOTI_SEND_STATUS, label: 'model.notification.typeSend.both' }, // gửi theo cả hai
];

export const NOTIFICATION_TYPES_STATUS = [
  { value: NOTIFICATION, label: NOTIFICATION },
  {
    value: EMAIL,
    label: EMAIL,
  },
];

export const NOTIFICATION_TYPE_SEEN_STATUS = [
  { value: true, label: 'status.read' }, // gửi theo người dùng
  {
    value: false,
    label: 'status.unread',
  },
];
