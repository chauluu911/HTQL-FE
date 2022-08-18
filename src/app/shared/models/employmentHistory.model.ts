export interface IEmploymentHistory {
  id?: string;
  departmentId?: string;
  departmentName?: string;
  title?: string;
  userId?: string;
  status?: boolean;
  deleted?: boolean;
  fullName?: string;
  startDate?: Date;
  endDate?: Date;
}
export class EmploymentHistory implements IEmploymentHistory {
  constructor(
    public id?: string,
    public departmentId?: string,
    public departmentName?: string,
    public title?: string,
    public userId?: string,
    public status?: boolean,
    public deleted?: boolean,
    public fullName?: string,
    public startDate?: Date,
    public endDate?: Date
  ) {
    this.id = id;
    this.departmentId = departmentId;
    this.title = title;
    this.departmentName = departmentName;
    this.userId = userId;
    this.status = status;
    this.deleted = deleted;
    this.fullName = fullName;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
