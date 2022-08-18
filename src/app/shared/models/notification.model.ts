import { IBuilding } from './building.model';
import { ICustomer } from './customer.model';
import { Department, IDepartment } from './department.model';
import { IFloor } from './floor.model';
import { IUser } from './user.model';

export interface INotification {
  id?: string;
  title?: string;
  content?: string;
  note?: string;
  buildings?: IBuilding[];
  floors?: IFloor[];
  organizations?: ICustomer[];
  buildingIds?: string;
  floorIds?: string;
  organizationIds?: string;
  fileIds?: string;
  eventFiles?: any;
  notificationAt?: any;
  expectedFinishAt?: any;
  expectedNotificationAt?: any;
  lastModifiedAt?: any;
  status?: string;
  eventLevel?: string;
  senderUsername?: string;
  issuedUserName?: string;
  issuedUserId?: string;
  checked?: boolean;
  disabled?: boolean;
  userIds?: IUser[];
  departmentIds?: IDepartment[];
  types?: string[];
  isRead?: boolean;
  isSend?: boolean;
  sendAt?: any;
  sendTo?: string;
  departments?: Department[];
}

export class Notification implements INotification {
  constructor(
    public id?: string,
    public title?: string,
    public content?: string,
    public note?: string,
    public buildings?: IBuilding[],
    public floors?: IFloor[],
    public organizations?: ICustomer[],
    public buildingIds?: string,
    public floorIds?: string,
    public organizationIds?: string,
    public fileIds?: string,
    public eventFiles?: string,
    public notificationAt?: any,
    public expectedNotificationAt?: any,
    public expectedFinishAt?: any,
    public lastModifiedAt?: any,
    public status?: string,
    public eventLevel?: string,
    public senderUsername?: string,
    public issuedUserName?: string,
    public issuedUserId?: string,
    public checked?: boolean,
    public disabled?: boolean,
    public userIds?: IUser[],
    public departmentIds?: IDepartment[],
    public types?: string[],
    public isRead?: boolean,
    public isSend?: boolean,
    public sendAt?: any,
    public sendTo?: string,
    public departments?: Department[]
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.buildings = buildings;
    this.floors = floors;
    this.organizations = organizations;
    this.buildingIds = buildingIds;
    this.floorIds = floorIds;
    this.organizationIds = organizationIds;
    this.fileIds = fileIds;
    this.eventFiles = eventFiles;
    this.expectedNotificationAt = expectedNotificationAt;
    this.expectedFinishAt = expectedFinishAt;
    this.notificationAt = notificationAt;
    this.lastModifiedAt = lastModifiedAt;
    this.status = status;
    this.eventLevel = eventLevel;
    this.senderUsername = senderUsername;
    this.issuedUserName = issuedUserName;
    this.issuedUserId = issuedUserId;
    this.checked = checked;
    this.disabled = disabled;
    this.userIds = userIds;
    this.departmentIds = departmentIds;
    this.types = types;
    this.isRead = isRead;
    this.isSend = isSend;
    this.sendAt = sendAt;
    this.sendTo = sendTo;
    this.departments = departments;
  }
}
