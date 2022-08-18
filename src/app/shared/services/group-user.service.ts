import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { Observable } from 'rxjs';
import { GroupUser, IGroupUser } from './../models/group.model';
import { IGroupUserRequest } from './../models/request/group-user-request.model';
import { AbstractService, EntityResponseType } from './common/abstract.service';
@Injectable({
  providedIn: 'root',
})
export class GroupUserService extends AbstractService {
  public resourceUrl = SERVICE.IAM + '/user-group';

  constructor(protected http: HttpClient) {
    super(http);
  }

  search(
    params?: IGroupUserRequest,
    loading = false
  ): Observable<EntityResponseType<IGroupUser[]>> {
    return super.get<IGroupUser[]>(`${this.resourceUrl}/search`, {
      params,
      loading,
    });
  }

  create(
    groupUser: GroupUser,
    loading = false
  ): Observable<EntityResponseType<IGroupUser>> {
    return super.post<IGroupUser>(`${this.resourceUrl}`, groupUser, {
      loading,
    });
  }
  remove(id: any, loading = false): Observable<EntityResponseType<IGroupUser>> {
    return super.post<IGroupUser>(`${this.resourceUrl}/${id}/delete`, {
      loading,
    });
  }
  update(
    groupUser: GroupUser,
    id: any,
    loading = false
  ): Observable<EntityResponseType<IGroupUser>> {
    return super.post<IGroupUser>(
      `${this.resourceUrl}/${id}/update`,
      groupUser,
      {
        loading,
      }
    );
  }
  find(id: any, loading = false): Observable<EntityResponseType<IGroupUser>> {
    return super.get<IGroupUser>(`${this.resourceUrl}/${id}`, { loading });
  }
  addMemberToGroup(
    groupId: any,
    params: any
  ): Observable<EntityResponseType<IGroupUser>> {
    return super.post<IGroupUser>(
      `${this.resourceUrl}/${groupId}/add-users`,
      params
    );
  }
  removeMemberFromGroup(
    groupId: any,
    params: any
  ): Observable<EntityResponseType<IGroupUser>> {
    return super.post<IGroupUser>(
      `${this.resourceUrl}/${groupId}/remove-users`,
      params
    );
  }
}
