import * as moment from 'moment';

export enum employmentHistoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum JobTitle {
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  VICE_MANAGER = 'VICE_MANAGER',
  LEADER = 'LEADER',
}

export interface IEmploymentHistory {
  id?: string;
  userId?: string;
  departmentId?: string;
  title?: JobTitle;
  deleted?: boolean;
  status?: employmentHistoryStatus;
  startDate?: Date | string;
  endDate?: Date | string;
}

export class EmploymentHistory implements IEmploymentHistory {
  constructor(
    public id?: string,
    public userId?: string,
    public departmentId?: string,
    public title?: JobTitle,
    public deleted?: boolean,
    public status?: employmentHistoryStatus,
    public startDate?: Date | string,
    public endDate?: Date | string
  ) {
    this.id = id;
    this.userId = userId;
    this.departmentId = departmentId;
    this.title = title;
    this.deleted = deleted;
    this.status = status;
    this.startDate = startDate;
    if (typeof startDate === 'string') {
      this.startDate = moment(startDate).format('yyyy-MM-DD');
    } else {
      this.startDate = startDate;
    }
    if (typeof endDate === 'string') {
      this.endDate = moment(endDate).format('yyyy-MM-DD');
    } else {
      this.endDate = endDate;
    }
  }
}
