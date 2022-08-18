import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { IMenuRequest, IMenuResponse, MenuRequest } from '@shared/models/booking/menu.model';
import { Observable } from 'rxjs';
import { AbstractService, EntityResponseType } from '../common/abstract.service';

@Injectable({
  providedIn: 'root'
})
export class FoodMenuService extends AbstractService {


  public resourceUrl = SERVICE.ORDER + '/menus';

  constructor(protected http: HttpClient) {
    super(http);
  }

  search(
    params: object
  ): Observable<EntityResponseType<any>> {
    return super.get<any>(`${this.resourceUrl}`, {
      params,
      loading: true,
    });

  };

  searchAutoComplete(
    params?: MenuRequest,
  ): Observable<EntityResponseType<IMenuResponse[]>> {
    return super.get<IMenuResponse[]>(`${this.resourceUrl}`, {
      params,
    });
  }

  getById(id: string): Observable<EntityResponseType<IMenuResponse>> {
    return super.get<IMenuRequest>(`${this.resourceUrl}/${id}/detail`);
  }

  create(menu: IMenuRequest): Observable<EntityResponseType<IMenuRequest>> {
    return super.post<IMenuRequest>(`${this.resourceUrl}`, menu);
  }

  update(id: string, menu: IMenuRequest): Observable<EntityResponseType<IMenuRequest>> {
    return super.post<IMenuRequest>(`${this.resourceUrl}/${id}/update`, menu);
  }

  delete(id: string): Observable<EntityResponseType<any>> {
    return super.post<{}>(`${this.resourceUrl}/${id}/delete`);
  }

  publish(id: string): Observable<EntityResponseType<any>> {
    return super.post<{}>(`${this.resourceUrl}/${id}/publish`);
  }

  unpublish(id: string): Observable<EntityResponseType<any>> {
    return super.post<{}>(`${this.resourceUrl}/${id}/unPublish`);
  }

  commit(id: string): Observable<EntityResponseType<any>> {
    return super.post<{}>(`${this.resourceUrl}/${id}/commit`);
  }

}
