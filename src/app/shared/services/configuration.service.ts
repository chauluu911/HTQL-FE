import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { IConfiguration } from '@shared/models/configuration.model';
import { IParameterSearchRequest } from '@shared/models/request/ParameterSearchRequest';
import {
  AbstractService,
  EntityResponseType,
} from '@shared/services/common/abstract.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService extends AbstractService {
  public resourceUrl = SERVICE.SYSTEM + '/configurations';

  constructor(protected http: HttpClient) {
    super(http);
  }

  find(
    id: any,
    loading = false
  ): Observable<EntityResponseType<IConfiguration>> {
    return super.get<IConfiguration>(`${this.resourceUrl}/${id}`, { loading });
  }

  create(
    parameter: IConfiguration,
    loading = false
  ): Observable<EntityResponseType<IConfiguration>> {
    return super.post<IConfiguration>(this.resourceUrl, parameter, { loading });
  }

  update(
    id: string,
    parameter: IConfiguration,
    loading = false
  ): Observable<EntityResponseType<IConfiguration>> {
    return super.post<IConfiguration>(
      `${this.resourceUrl}/${id}/update`,
      parameter,
      { loading }
    );
  }

  delete(
    id: string,
    loading = false
  ): Observable<EntityResponseType<IConfiguration>> {
    return super.post<IConfiguration>(
      `${this.resourceUrl}/${id}/delete`,
      {},
      { loading }
    );
  }

  active(
    id: string,
    loading = false
  ): Observable<EntityResponseType<IConfiguration>> {
    return super.post<IConfiguration>(
      `${this.resourceUrl}/${id}/active`,
      {},
      { loading }
    );
  }

  deActive(
    id: string,
    loading = false
  ): Observable<EntityResponseType<IConfiguration>> {
    return super.post<IConfiguration>(
      `${this.resourceUrl}/${id}/inactive`,
      {},
      { loading }
    );
  }

  search(
    params?: IParameterSearchRequest,
    loading = true
  ): Observable<EntityResponseType<IConfiguration[]>> {
    return super.get<IConfiguration>(`${this.resourceUrl}`, {
      loading,
      params,
    });
  }
}
