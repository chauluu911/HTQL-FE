import { EmploymentHistory } from './employment.model';
export interface IDepartment {
  id?: string;
  code?: string;
  name?: string;
  parentId?: string;
  description?: string;
  status?: string;
  createdAt?: Date;
  createdBy?: string;
  lastModifiedAt?: Date;
  lastModifiedBy?: string;
  deleted?: boolean;
  checked?: boolean;
  employmentHistories?: EmploymentHistory;
  children?: IDepartment[];
}

export class Department implements IDepartment {
  constructor(
    public id?: string,
    public code?: string,
    public name?: string,
    public description?: string,
    public status?: string,
    public createdDate?: number,
    public createdBy?: string,
    public lastModifiedAt?: Date,
    public lastModifiedBy?: string,
    public deleted?: boolean,
    public parentId?: string,
    public checked?: boolean,
    public employmentHistories?: EmploymentHistory,
    public children?: IDepartment[]
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.description = description;
    this.status = status;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.lastModifiedAt = lastModifiedAt;
    this.lastModifiedBy = lastModifiedBy;
    this.deleted = deleted;
    this.parentId = parentId;
    this.checked = checked;
    this.employmentHistories = employmentHistories;
    this.children = children;
  }
}
