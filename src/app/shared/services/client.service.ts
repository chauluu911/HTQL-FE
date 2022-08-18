import {Injectable} from '@angular/core';
import {AbstractService, EntityResponseType} from '@shared/services/common/abstract.service';
import {HttpClient} from '@angular/common/http';
import {SERVICE} from '@shared/constants/gateway-routes-api.constant';
import {Observable} from 'rxjs';
import {IClient} from '@shared/models/client.model';
import {IClientSearchRequest} from '@shared/models/request/clientSearch';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends AbstractService {
  public resourceUrl = SERVICE.IAM + '/clients';

  constructor(protected http: HttpClient) {
    super(http);
  }

  searchClient(params?: IClientSearchRequest, loading = true): Observable<EntityResponseType<IClient[]>> {
    return super.get<IClient[]>(this.resourceUrl, {params, loading});
  }

  activeClient(id: string, loading = false): Observable<EntityResponseType<IClient>> {
    return super.post<IClient>(`${this.resourceUrl}/${id}/active`, {}, {loading});
  }

  inactiveClient(id: string, loading = false): Observable<EntityResponseType<IClient>> {
    return super.post<IClient>(`${this.resourceUrl}/${id}/inactive`, {}, {loading});
  }

  findById(id: string, loading = true): Observable<EntityResponseType<IClient>> {
    return super.get<IClient>(`${this.resourceUrl}/${id}`, {loading});
  }

  create(client: IClient, loading = true): Observable<EntityResponseType<IClient>> {
    return super.post<IClient>(`${this.resourceUrl}`, client, {loading});
  }

  update(id: string, client: IClient, loading = true): Observable<EntityResponseType<IClient>> {
    return super.post<IClient>(`${this.resourceUrl}/${id}/update`, client, {loading});
  }
}
