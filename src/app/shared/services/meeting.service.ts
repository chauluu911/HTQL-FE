import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { IMeeting } from '@shared/models/meeting.model';
import { MeetingRequest } from '@shared/models/request/meeting-request';
import { MeetingUpdateRequest } from '@shared/models/request/meeting-update-request.model';
import { Observable } from 'rxjs';
import { AbstractService, EntityResponseType } from './common/abstract.service';

@Injectable({
  providedIn: 'root',
})
export class MeetingService extends AbstractService {
  public resourceUrl = SERVICE.MEETING + '/meets';

  constructor(protected http: HttpClient) {
    super(http);
  }

  /**
   * @description : create meeting
   * @return IMeeting
   */
  create(
    createRequest: MeetingUpdateRequest,
  ): Observable<EntityResponseType<IMeeting>> {
    return super.post<IMeeting>(`${this.resourceUrl}`, createRequest);
  }

  /**
   * @description : update meeting
   * @return IMeeting
   */
  update(
    updateRequest: MeetingUpdateRequest,
    id: string,
  ): Observable<EntityResponseType<IMeeting>> {
    return super.post<IMeeting>(
      `${this.resourceUrl}/${id}/update`, updateRequest);
  }

  /**
   * @description : search meeting
   * @return IMeeting[]
   * @param parmas MeetingRequest
   */
  search(
    params?: MeetingRequest,
    loading = false
  ): Observable<EntityResponseType<IMeeting[]>> {
    return super.get<IMeeting[]>(`${this.resourceUrl}`, { params, loading });
  }

  /**
   * @description : cancel meeting
   * @return IMeeting
   * @param id string
   */
  cancel(
    id: string,
  ): Observable<EntityResponseType<IMeeting>> {
    return super.post<IMeeting>(
      `${this.resourceUrl}/${id}/cancel`
    );
  }

  /**
   * @description : delete meeting
   * @return IMeeting
   * @param id string
   */
   delete(
    id: string,
  ): Observable<EntityResponseType<IMeeting>> {
    return super.post<IMeeting>(
      `${this.resourceUrl}/${id}/delete`
    );
  }

  /**
   * @description : find meeting by id
   * @return IMeeting
   * @param loading false
   * @param id string
   */
  findByMeetingId(
    id: string,
    loading = false
  ): Observable<EntityResponseType<IMeeting>> {
    return super.get<IMeeting>(`${this.resourceUrl}/${id}`, { loading });
  }

  /**
   * @description : approve meeting
   * @return IMeeting
   * @param id string
   */
  approve(
    id: string,
  ): Observable<EntityResponseType<IMeeting>> {
    return super.post<IMeeting>(
      `${this.resourceUrl}/${id}/approve`
    );
  }

  /**
   * @description : reject meeting
   * @return IMeeting
   * @param id string
   */
  reject(
    id: string,
  ): Observable<EntityResponseType<IMeeting>> {
    return super.post<IMeeting>(
      `${this.resourceUrl}/${id}/reject`
    );
  }
}
