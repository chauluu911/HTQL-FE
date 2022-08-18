import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ASSET_TYPE_ACTIVE,
  ASSET_TYPE_STATUS,
} from '@shared/constants/asset.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { IAsset } from '@shared/models/asset.model';
import { AssetRequest } from '@shared/models/request/asset-request.model';
import { AssetService } from '@shared/services/asset.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UpdateAssetTypeComponent } from '../update-asset-type/update-asset-type.component';

@Component({
  selector: 'app-asset-type',
  templateUrl: './asset-type.component.html',
  styleUrls: ['./asset-type.component.scss'],
})
export class AssetTypeComponent implements OnInit {
  assets: IAsset[] = [];
  asset: IAsset = {};
  keyword: string = '';
  isCallFirstRequest = true;
  isCallSecondRequest = true;
  assetRequest: AssetRequest = {};
  assetSearchRequest: AssetRequest = {
    keyword: '',
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    sortBy: '',
  };
  total = 0;
  assetTypeStatus = ASSET_TYPE_STATUS;
  assetTypeActive = ASSET_TYPE_ACTIVE;
  assetTypeInactive = ASSET_TYPE_ACTIVE;
  public formSearchAsset: FormGroup = new FormGroup({});
  public translatePath = 'model.configuration.';
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private translateService: TranslateService,
    private assetService: AssetService,
    private modalService: NzModalService,
    private toast: ToastService
  ) {}
  ngOnInit(): void {
    this.formSearchAsset = this.fb.group({
      keyword: [''],
      status: [''],
    });
    this.assetService
      .assetTypeSearch(this.assetSearchRequest, true)
      .subscribe((next) => {
        this.assets = next?.body?.data as Array<IAsset>;
        this.total = next?.body?.page?.total || 0;
      });
  }
  search() {
    this.assetSearchRequest = {
      ...this.assetSearchRequest,
      ...this.formSearchAsset.value,
    };
    this.assetSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.assetService
      .assetTypeSearch(this.assetSearchRequest, true)
      .subscribe((res: any) => {
        this.assets = res.body?.data;
        this.total = res.body?.page?.total || 0;
      });
  }
  clearSearch() {
    this.formSearchAsset.reset();
    this.assetSearchRequest = this.formSearchAsset.value;
    this.assetSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.assetSearchRequest.pageSize = PAGINATION.SIZE_DEFAULT;
    this.assetSearchRequest.sortBy = '';
    this.ngOnInit();
  }
  public getTranslate(key: string): string {
    return this.translate.instant(this.translatePath + key);
  }
  getIndex(index: number): number {
    return CommonUtil.getIndex(
      index,
      this.assetSearchRequest.pageIndex,
      this.assetSearchRequest.pageSize
    );
  }
  getColor(status: string): string {
    if (!status) {
      return '-';
    }
    if (status === this.assetTypeActive) {
      return 'badge-info';
    } else if (status === this.assetTypeInactive) {
      return 'badge-secondary';
    }

    return '';
  }
  format(value: any, type: string): any {
    if (type === 'date') {
      return CommonUtil.formatArrayToDate(value);
    } else if (type === 'status') {
      return this.translateService.instant(
        ['model.asset.type', value.toLowerCase()].join('.')
      );
    }
  }
  onQuerySearch(params: { pageIndex: number; pageSize: number }): void {
    const { pageIndex, pageSize } = params;
    this.assetSearchRequest.pageIndex = pageIndex;
    this.assetSearchRequest.pageSize = pageSize;
    this.ngOnInit();
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isCallFirstRequest) {
      this.isCallFirstRequest = false;
      return;
    }
    if (this.isCallSecondRequest) {
      this.isCallSecondRequest = false;
      return;
    }
    const { sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    let sortBy = '';
    if (sortField && sortOrder) {
      sortBy = `${sortField}.${sortOrder === 'ascend' ? 'asc' : 'desc'}`;
    }
    this.assetSearchRequest.sortBy = sortBy;
    this.ngOnInit();
  }
  create(): void {
    const base = CommonUtil.modalBase(
      UpdateAssetTypeComponent,
      {
        isUpdate: false,
      },
      '40%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.assetSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.ngOnInit();
      }
    });
  }
  update(asset: IAsset): void {
    const base = CommonUtil.modalBase(
      UpdateAssetTypeComponent,
      {
        isUpdate: true,
        asset,
      },
      '40%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.ngOnInit();
      }
    });
  }
  delete(asset: IAsset): void {
    this.asset = asset;
    if (this.asset?.id) {
      this.assetService
        .deleteAssetType(this.asset.id, true)
        .subscribe((res) => {
          this.toast.success('model.asset.deleteSuccess');
          this.assetSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
          this.ngOnInit();
        });
    }
  }
}
