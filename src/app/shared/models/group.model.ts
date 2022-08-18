import { IUser } from './user.model';
export interface IGroupUser {
  id?: string;
  name?: string;
  type?: string;
  description?: string;
  totalMember?: number;
  members?: IUser[];
  code?: string;
}
export class GroupUser implements IGroupUser {
  constructor(
    public id?: string,
    public name?: string,
    public type?: string,
    public description?: string,
    public totalMember?: number,
    public members?: IUser[],
    public code?: string
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.description = description;
    this.totalMember = totalMember;
    this.members = members;
    this.code = code;
  }
}
