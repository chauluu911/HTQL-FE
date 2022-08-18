import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { Department, IDepartment } from '@shared/models/department.model';
import { IDepartmentRequest } from '@shared/models/request/department-request.model';
import {
  AbstractService,
  EntityResponseType
} from '@shared/services/common/abstract.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService extends AbstractService {
  public resourceUrl = SERVICE.IAM + '/departments';

  constructor(protected http: HttpClient) {
    super(http);
  }

  create(
    department: Department,
    loading = false
  ): Observable<EntityResponseType<IDepartment>> {
    return super.post<IDepartment>(`${this.resourceUrl}`, department, {
      loading,
    });
  }

  update(
    department: Department,
    id: any,
    loading = false
  ): Observable<EntityResponseType<IDepartment>> {
    return super.post<IDepartment>(
      `${this.resourceUrl}/${id}/update`,
      department,
      {
        loading,
      }
    );
  }

  delete(
    id: any,
    loading = false
  ): Observable<EntityResponseType<IDepartment>> {
    return super.post<IDepartment>(
      `${this.resourceUrl}/${id}/delete`,
      {},
      { loading }
    );
  }

  findById(
    id: any,
    loading = false
  ): Observable<EntityResponseType<IDepartment>> {
    return super.get<IDepartment>(`${this.resourceUrl}/${id}`, { loading });
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

  // Api lấy hết list role
  /**
   * search
   *
   * @param params IDepartmentRequest
   * @param loading false
   * @returns Observable<EntityResponseType<IDepartment[]>>
   */
  search(
    params?: IDepartmentRequest,
    loading = false
  ): Observable<EntityResponseType<IDepartment[]>> {
    return super.get<IDepartment[]>(`${this.resourceUrl}/search`, {
      params,
      loading,
    });
  }

  autoComplete(
    params?: IDepartmentRequest,
    loading = false
  ): Observable<EntityResponseType<IDepartment[]>> {
    return super.get<IDepartment[]>(`${this.resourceUrl}/auto-complete`, {
      params,
      loading,
    });
  }

  /**
   * search auto complete
   *
   * @param params IDepartmentRequest
   * @param loading false
   * @returns Observable<EntityResponseType<IDepartment[]>>
   */
  searchAutoComplete(
    params?: IDepartmentRequest,
    loading = false
  ): Observable<EntityResponseType<IDepartment[]>> {
    return super.get<IDepartment[]>(`${this.resourceUrl}/auto-complete`, {
      params,
      loading,
    });
  }

  getAllRoots(loading = false): Observable<EntityResponseType<IDepartment[]>> {
    return super.get<IDepartment[]>(`${this.resourceUrl}/roots`, {
      loading,
    });
  }

  getAllExcludeProgeny(
    id: any,
    loading = false
  ): Observable<EntityResponseType<IDepartment[]>> {
    return super.get<IDepartment[]>(
      `${this.resourceUrl}/${id}/exclude-progeny`,
      { loading }
    );
  }

  getProgeny(
    params: any,
    loading = false
  ): Observable<EntityResponseType<IDepartment>> {
    return super.get<string>(
      `${this.resourceUrl}/find-all-progeny-by-parent-ids`,
      { params, loading }
    );
  }

  getTreeView(
    id: any,
    loading = false
  ): Observable<EntityResponseType<IDepartment>> {
    return super.get<IDepartment>(
      `${this.resourceUrl}/${id}/tree-view`,
      { id, loading }
    );
  }
}
