import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { RoomRequest } from '@shared/models/request/room-request';
import { RoomSchedulerRequest } from '@shared/models/request/room-scheduler-request.model';
import { IRoomSchedulerResponse } from '@shared/models/room-scheduler-response.model';
import { IRoom, Room } from '@shared/models/room.model';
import { Observable } from 'rxjs';
import { AbstractService, EntityResponseType } from './common/abstract.service';

@Injectable({
  providedIn: 'root',
})
export class RoomService extends AbstractService {
  public resourceUrl = SERVICE.MEETING + '/rooms';

  constructor(protected http: HttpClient) {
    super(http);
  }

  /**
   * @description : create room
   * @return IRoom
   */
  create(room: Room): Observable<EntityResponseType<IRoom>> {
    return super.post<IRoom>(`${this.resourceUrl}`, room);
  }

  /**
   * @description : search room
   * @return IRoom[]
   * @param loading false
   * @param params RoomRequest
   */
  search(
    params?: RoomRequest,
    loading = false
  ): Observable<EntityResponseType<IRoom[]>> {
    return super.get<IRoom[]>(`${this.resourceUrl}`, { params, loading });
  }

  /**
   * @description : find room by id
   * @return IRoom
   * @param loading false
   * @param roomId string
   */
  findByRoomId(
    roomId: string,
    loading = false
  ): Observable<EntityResponseType<IRoom>> {
    return super.get<IRoom>(`${this.resourceUrl}/${roomId}`, { loading });
  }

  /**
   * @description : update room
   * @return IRoom
   * @param id any
   */
  update(
    room: Room,
    id: any,
  ): Observable<EntityResponseType<IRoom>> {
    return super.post<IRoom>(`${this.resourceUrl}/${id}/update`, room);
  }

  /**
   * @description : delete room
   * @return IRoom
   * @param id any
   */
  delete(id: any): Observable<EntityResponseType<IRoom>> {
    return super.post<IRoom>(
      `${this.resourceUrl}/${id}/delete`
    );
  }

  /**
   * @description : active room
   * @return boolean
   * @param roomId any
   */
  active(
    roomId: any,
  ): Observable<EntityResponseType<boolean>> {
    return super.post<boolean>(
      `${this.resourceUrl}/${roomId}/active`
    );
  }

  /**
   * @description : inactive room
   * @return boolean
   * @param roomId any
   */
  inactive(
    roomId: any,
  ): Observable<EntityResponseType<boolean>> {
    return super.post<boolean>(
      `${this.resourceUrl}/${roomId}/inactive`
    );
  }

  /**
   * @description : search autoComplete
   * @return IRoom[]
   * @param loading false
   * @param params RoomRequest
   */
  searchAutoComplete(
    params?: RoomRequest,
    loading = false
  ): Observable<EntityResponseType<IRoom[]>> {
    return super.get<IRoom[]>(`${this.resourceUrl}/auto-complete`, {
      params,
      loading,
    });
  }

  /**
   * @description : get room scheduler
   * @return IRoomSchedulerResponse[]
   * @param loading false
   * @param params RoomSchedulerRequest
   * @param id string
   */
  getRoomScheduler(
    id: string,
    params?: RoomSchedulerRequest,
    loading = false
  ): Observable<EntityResponseType<IRoomSchedulerResponse[]>> {
    return super.get<IRoomSchedulerResponse[]>(
      `${this.resourceUrl}/room-schedulers/${id}`,
      { loading, params }
    );
  }
}
