import { ConfigurationType } from '@shared/models/enum/configuration-type.enum';
import { IBaseRequestModel } from '@shared/models/request/base-request.model';

export interface IParameterSearchRequest extends IBaseRequestModel {
  status?: string;
  types?: ConfigurationType[];
  createAtFrom?: number;
  createAtTo?: number;
  createdUserIds?: string[];
}
