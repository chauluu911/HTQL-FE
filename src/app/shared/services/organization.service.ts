import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { IOrganization, Organization } from '@shared/models/organization.model';
import { IOrganizationRequest } from '@shared/models/request/organization-request.model';

import {
  AbstractService,
  EntityResponseType,
} from '@shared/services/common/abstract.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService extends AbstractService {
  public resourceUrl = SERVICE.IAM + '/organizations';

  constructor(protected http: HttpClient) {
    super(http);
  }

  create(
    organization: Organization,
    loading = false
  ): Observable<EntityResponseType<IOrganization>> {
    return super.post<IOrganization>(`${this.resourceUrl}`, organization, {
      loading,
    });
  }

  update(
    organization: Organization,
    id: any,
    loading = false
  ): Observable<EntityResponseType<IOrganization>> {
    return super.post<IOrganization>(
      `${this.resourceUrl}/${id}/update`,
      organization,
      {
        loading,
      }
    );
  }

  delete(
    id: any,
    loading = false
  ): Observable<EntityResponseType<IOrganization>> {
    return super.post<IOrganization>(
      `${this.resourceUrl}/${id}/delete`,
      {},
      { loading }
    );
  }

  findById(
    id: any,
    loading = false
  ): Observable<EntityResponseType<IOrganization>> {
    return super.get<IOrganization>(`${this.resourceUrl}/${id}`, { loading });
  }

  /**
   * active
   *
   * @param id any
   * @param loading false
   * @returns Observable<EntityResponseType<boolean>>
   */
  active(id: any, loading = false): Observable<EntityResponseType<boolean>> {
    return super.post<boolean>(
      `${this.resourceUrl}/${id}/active`,
      {},
      { loading }
    );
  }

  /**
   * inactive
   *
   * @param id any
   * @param loading false
   * @returns Observable<EntityResponseType<boolean>>
   */
  inActive(id: any, loading = false): Observable<EntityResponseType<boolean>> {
    return super.post<boolean>(
      `${this.resourceUrl}/${id}/inactive`,
      {},
      { loading }
    );
  }

  // Api list and search
  /**
   * search
   *
   * @param params IDepartmentRequest
   * @param loading false
   * @returns Observable<EntityResponseType<IDepartment[]>>
   */
  search(
    params?: IOrganizationRequest,
    loading = false
  ): Observable<EntityResponseType<IOrganization[]>> {
    return super.get<IOrganization[]>(`${this.resourceUrl}/search`, {
      params,
      loading,
    });
  }
}
