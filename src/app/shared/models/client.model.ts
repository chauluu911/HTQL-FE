export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface IClient {
  id?: string;
  name?: string;
  status?: ClientStatus;
  secret?: string;
  deleted?: boolean
  roleId?: string;
  createdByName?: string;
  createdBy?: string;
  secretToken?: string;
}
