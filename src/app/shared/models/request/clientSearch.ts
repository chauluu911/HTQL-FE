import {IBaseRequestModel} from '@shared/models/request/base-request.model';

export interface IClientSearchRequest extends IBaseRequestModel {
  status?: string;
  roleIds?: string[]
}
