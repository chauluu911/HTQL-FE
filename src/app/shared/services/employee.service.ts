import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { Observable } from 'rxjs';
import { IEmployee } from './../models/employee.model';
import { IEmployeeRequest } from './../models/request/employee-request.model';
import { AbstractService, EntityResponseType } from './common/abstract.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService extends AbstractService {
  public resourceUrl = SERVICE.IAM + '/employees';
  constructor(protected http: HttpClient) {
    super(http);
  }
  search(
    params?: IEmployeeRequest,
    loading = false
  ): Observable<EntityResponseType<IEmployeeRequest[]>> {
    return super.get<IEmployee[]>(`${this.resourceUrl}/`, {
      params,
      loading,
    });
  }

  find(id: any, loading = false): Observable<EntityResponseType<IEmployee>> {
    return super.get<IEmployee>(`${this.resourceUrl}/${id}`, { loading });
  }
}
