import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { IAsset } from '@shared/models/asset.model';
import { AssetRequest } from '@shared/models/request/asset-request.model';
import { Observable } from 'rxjs';
import { AbstractService, EntityResponseType } from './common/abstract.service';

@Injectable({
  providedIn: 'root',
})
export class AssetService extends AbstractService {
  public resourceUrl = SERVICE.ASSET + '/assets';
  public resourceAssetTypeUrl = SERVICE.ASSET + '/asset-types';

  constructor(protected http: HttpClient) {
    super(http);
  }

  assetSearch(
    params?: any,
    loading = true
  ): Observable<EntityResponseType<IAsset[]>> {
    return super.get<IAsset[]>(`${this.resourceUrl}/search`, {
      params,
      loading,
    });
  }

  assetTypeSearch(
    params?: any,
    loading = false
  ): Observable<EntityResponseType<IAsset[]>> {
    return super.get<IAsset[]>(`${this.resourceAssetTypeUrl}/search`, {
      params,
      ignoreError: true,
      loading,
    });
  }

  findAssetById(
    id: any,
    loading = true
  ): Observable<EntityResponseType<IAsset>> {
    return super.get<IAsset>(`${this.resourceUrl}/${id}`, {
      loading,
    });
  }

  findAssetTypeById(
    id: any,
    loading = true
  ): Observable<EntityResponseType<IAsset>> {
    return super.get<IAsset>(`${this.resourceAssetTypeUrl}/${id}`, {
      loading,
    });
  }

  createAsset(
    body: AssetRequest,
    loading = true
  ): Observable<EntityResponseType<IAsset>> {
    return super.post<IAsset>(`${this.resourceUrl}`, body, {
      loading,
    });
  }
  createAssetType(
    body: AssetRequest,
    loading = true
  ): Observable<EntityResponseType<IAsset>> {
    return super.post<IAsset>(`${this.resourceAssetTypeUrl}`, body, {
      loading,
    });
  }

  updateAsset(
    body: AssetRequest,
    id: any,
    loading = true
  ): Observable<EntityResponseType<IAsset>> {
    return super.post<IAsset>(`${this.resourceUrl}/${id}/update`, body, {
      loading,
    });
  }
  updateAssetType(
    body: AssetRequest,
    id: any,
    loading = true
  ): Observable<EntityResponseType<IAsset>> {
    return super.post<IAsset>(
      `${this.resourceAssetTypeUrl}/${id}/update`,
      body,
      { loading }
    );
  }
  deleteAsset(id: any, loading = true): Observable<EntityResponseType<IAsset>> {
    return super.post<IAsset>(`${this.resourceUrl}/${id}/delete`, {
      loading,
    });
  }

  deleteAssetType(
    id: any,
    loading = true
  ): Observable<EntityResponseType<IAsset>> {
    return super.post<IAsset>(`${this.resourceAssetTypeUrl}/${id}/delete`, {
      loading,
    });
  }
}
