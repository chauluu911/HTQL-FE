import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { ChangeOrderStatusRequest, IOrderRequest } from '@shared/models/booking/order.model';
import { Observable } from 'rxjs';
import { AbstractService, EntityResponseType } from '../common/abstract.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends AbstractService {

  public resourceUrl = SERVICE.ORDER + '/purchase-order';

  constructor(protected http: HttpClient) {
    super(http);
  }

  search(
    params?: any
  ): Observable<EntityResponseType<any>> {
    return super.get<any>(`${this.resourceUrl}`, {
      params,
      loading: true
    });

  };

  getById(id: string): Observable<EntityResponseType<IOrderRequest>> {
    return super.get<IOrderRequest>(`${this.resourceUrl}/${id}/detail`);
  }

  create(order: IOrderRequest): Observable<EntityResponseType<IOrderRequest>> {
    return super.post<IOrderRequest>(`${this.resourceUrl}`, order);
  }

  update(id: string, order: IOrderRequest): Observable<EntityResponseType<IOrderRequest>> {
    return super.post<IOrderRequest>(`${this.resourceUrl}/${id}/update`, order);
  }

  delete(id: string): Observable<EntityResponseType<any>> {
    return super.post<{}>(`${this.resourceUrl}/${id}/delete`);
  }

  changeStatusToOrder(request: ChangeOrderStatusRequest) {
    return super.post<{}>(`${this.resourceUrl}/change-status-order`, request);
  }

  changeStatusToPaid(request: ChangeOrderStatusRequest) {
    return super.post<{}>(`${this.resourceUrl}/change-status-paid`, request);
  }

  revertStatusToOrder(request: ChangeOrderStatusRequest) {
    return super.post<{}>(`${this.resourceUrl}/revert-status-order`, request);
  }

}
