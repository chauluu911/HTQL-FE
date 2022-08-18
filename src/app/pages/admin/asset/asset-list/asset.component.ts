import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ASSET_DESTROY,
  ASSET_LABELED,
  ASSET_LIQUIDATE,
  ASSET_MAINTAIN,
  ASSET_NEW,
  ASSET_NOT_USED,
  ASSET_STATUS,
  ASSET_USED,
} from '@shared/constants/asset.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { IAsset } from '@shared/models/asset.model';
import { AssetRequest } from '@shared/models/request/asset-request.model';
import { AssetService } from '@shared/services/asset.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UpdateAssetComponent } from '../update-asset/update-asset.component';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
})
export class AssetComponent implements OnInit {
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
  assetStatus = ASSET_STATUS;
  assetNew = ASSET_NEW;
  assetDestroy = ASSET_DESTROY;
  assetLabeled = ASSET_LABELED;
  assetMaintain = ASSET_MAINTAIN;
  assetLiquidate = ASSET_LIQUIDATE;
  assetUsed = ASSET_USED;
  assetNotUsed = ASSET_NOT_USED;
  public formSearchAsset: FormGroup = new FormGroup({});
  public translatePath = 'model.configuration.';
  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private translate: TranslateService,
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
      .assetSearch(this.assetSearchRequest, true)
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
      .assetSearch(this.assetSearchRequest, true)
      .subscribe((next) => {
        this.assets = next?.body?.data as Array<IAsset>;
        this.total = next?.body?.page?.total || 0;
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
  onQuerySearch(params: { pageIndex: number; pageSize: number }): void {
    const { pageIndex, pageSize } = params;
    this.assetSearchRequest.pageIndex = pageIndex;
    this.assetSearchRequest.pageSize = pageSize;
    this.ngOnInit();
  }
  public getTranslate(key: string): string {
    return this.translate.instant(this.translatePath + key);
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
    if (status === this.assetNew) {
      return 'badge-info';
    } else if (status === this.assetDestroy) {
      return 'badge-secondary';
    } else if (status === this.assetLabeled) {
      return 'badge-success';
    } else if (status === this.assetMaintain) {
      return 'badge-warning';
    } else if (status === this.assetLiquidate) {
      return 'badge-liquidate';
    } else if (status === this.assetUsed) {
      return 'badge-danger';
    } else if (status === this.assetNotUsed) {
      return 'badge-notused';
    }

    return '';
  }
  format(value: any, type: string): any {
    if (type === 'date') {
      return CommonUtil.formatArrayToDate(value);
    } else if (type === 'status') {
      return this.translateService.instant(
        ['model.asset', value.toLowerCase()].join('.')
      );
    }
  }
  create(): void {
    const base = CommonUtil.modalBase(
      UpdateAssetComponent,
      {
        isUpdate: false,
      },
      '80%'
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
      UpdateAssetComponent,
      {
        isUpdate: true,
        asset,
      },
      '80%'
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
      this.assetService.deleteAsset(this.asset.id, true).subscribe((res) => {
        this.toast.success('model.asset.deleteSuccess');
        this.assetSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.ngOnInit();
      });
    }
  }
}
