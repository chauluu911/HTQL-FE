import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { UserSchedulerRequest } from '@shared/models/request/user-scheduler-request.model';
import { IUserSchedulerResponse } from '@shared/models/user-scheduler-response.model';
import { Observable } from 'rxjs';
import { AbstractService, EntityResponseType } from './common/abstract.service';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService extends AbstractService {

  public resourceUrl = SERVICE.MEETING + '/me';

  constructor(protected http: HttpClient) {
    super(http);
  }

  /**
   * @description : get user scheduler
   * @return IUserSchedulerResponse[]
   * @param loading false
   * @param params UserSchedulerRequest
   * @param id string
   */
  getScheduler(
   params?: UserSchedulerRequest,
   loading = false
  ): Observable<EntityResponseType<IUserSchedulerResponse[]>> {
    return super.get<IUserSchedulerResponse[]>(`${this.resourceUrl}/schedulers`, {
      loading, params
    });
  }

  /**
   * @description : reject user scheduler
   * @return void
   * @param userSchedulerId string
   */
  rejectUserScheduler(
    userSchedulerId: string,
  ): Observable<EntityResponseType<void>> {
    return super.post<void>(
      `${this.resourceUrl}/schedulers/${userSchedulerId}/reject`
    );
  }
}
