export interface IConfiguration {
  id?: string;
  code?: string;
  createdAt?: number;
  createdBy?: string;
  createdByName?: string;
  name?: string;
  status?: 'ACTIVE' | 'INACTIVE' | string;
  type?: string;
  value?: string;
  deleted?: boolean;
  createdUserId?: string;
}

export class Parameter implements IConfiguration {
  id?: string;
  code?: string;
  createdAt?: number;
  createdBy?: string;
  name?: string;
  status?: 'ACTIVE' | 'INACTIVE' | string;
  type?: string;
  value?: string;
  deleted?: boolean;
  createdByName?: string;
  createdUserId?: string;

  constructor(data?: IConfiguration) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (this as any)[property] = (data as any)[property];
        }
      }
    }
  }
}
