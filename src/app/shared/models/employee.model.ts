import { EmploymentHistory } from './employmentHistory.model';

export interface IEmployee {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  dayOfBirth?: string;
  gender?: string;
  avatarFileId?: string;
  avatarFileUrl?: string;
  employeeCode?: string;
  title?: string;
  description?: string;
  status?: string;
  departmentName?: string;
  employeeLevel?: string;
  deleted?: boolean;
  checked?: boolean;
  username?: string;
  jobTitle?: string;
  companyCode?: string;
  accountTelegram?: string;
  employmentHistories?: EmploymentHistory[];
}

export class Employee implements IEmployee {
  constructor(
    public id?: string,
    public fullName?: string,
    public email?: string,
    public phoneNumber?: string,
    public dayOfBirth?: string,
    public gender?: string,
    public employeeCode?: string,
    public title?: string,
    public description?: string,
    public status?: string,
    public departmentName?: string,
    public avatarFileId?: string,
    public employeeLevel?: string,
    public avatarFileUrl?: string,
    public deleted?: boolean,
    public checked?: boolean,
    public username?: string,
    public jobTitle?: string,
    public companyCode?: string,
    public accountTelegram?: string,
    public employmentHistories?: EmploymentHistory[]
  ) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.dayOfBirth = dayOfBirth;
    this.gender = gender;
    this.employeeCode = employeeCode;
    this.title = title;
    this.description = description;
    this.status = status;
    this.departmentName = departmentName;
    this.avatarFileId = avatarFileId;
    this.avatarFileUrl = avatarFileUrl;
    this.deleted = deleted;
    this.checked = checked;
    this.employeeLevel = employeeLevel;
    this.username = username;
    this.jobTitle = jobTitle;
    this.companyCode = companyCode;
    this.accountTelegram = accountTelegram;
    this.employmentHistories = employmentHistories;
  }
}
