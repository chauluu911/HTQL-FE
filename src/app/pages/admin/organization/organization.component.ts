import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  ORGANIZATION_ACTIVE,
  ORGANIZATION_INACTIVE,
  ORGANIZATION_STATUS,
  ORGANIZATION_TYPE_STATUS,
} from '@shared/constants/organization.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { IOrganization } from '@shared/models/organization.model';
import { IOrganizationRequest } from '@shared/models/request/organization-request.model';
import { ToastService } from '@shared/services/helpers/toast.service';
import { OrganizationService } from '@shared/services/organization.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { LocalStorageService } from 'ngx-webstorage';
import { UpdateOrganizationComponent } from './update-organization/update-organization.component';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent implements OnInit {
  organizations: IOrganization[] = [];
  organization: IOrganization = {};
  keyword: string = '';
  isCallFirstRequest = true;
  isCallSecondRequest = true;
  organizationRequest: IOrganizationRequest = {};
  organizationSearchRequest: IOrganizationRequest = {
    keyword: '',
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    sortBy: '',
  };
  total = 0;
  organizationStatus = ORGANIZATION_STATUS;
  organizationTypeStatus = ORGANIZATION_TYPE_STATUS;
  ORGANIZATION_ACTIVE = ORGANIZATION_ACTIVE;
  ORGANIZATION_INACTIVE = ORGANIZATION_INACTIVE;
  public formSearchOrg: FormGroup = new FormGroup({});
  public translatePath = 'model.configuration.';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private organizationService: OrganizationService,
    private translateService: TranslateService,
    private $localStorage: LocalStorageService,
    private toast: ToastService,
    private modalService: NzModalService,
    private translate: TranslateService
  ) {}
  ngOnInit(): void {
    this.formSearchOrg = this.fb.group({
      keyword: [''],
      status: [''],
    });
    this.organizationService
      .search(this.organizationSearchRequest, true)
      .subscribe((next) => {
        this.organizations = next?.body?.data as Array<IOrganization>;
        this.total = next?.body?.page?.total || 0;
      });
  }
  getIndex(index: number): number {
    return CommonUtil.getIndex(
      index,
      this.organizationSearchRequest.pageIndex,
      this.organizationSearchRequest.pageSize
    );
  }
  getColor(status: string): string {
    if (!status) {
      return '-';
    }
    if (status === this.ORGANIZATION_ACTIVE) {
      return 'badge-info';
    } else if (status === this.ORGANIZATION_INACTIVE) {
      return 'badge-secondary';
    }

    return '';
  }
  format(value: any, type: string): any {
    if (type === 'date') {
      return CommonUtil.formatArrayToDate(value);
    } else if (type === 'status') {
      return this.translateService.instant(
        ['common', value.toLowerCase()].join('.')
      );
    }
  }
  onQuerySearch(params: { pageIndex: number; pageSize: number }): void {
    const { pageIndex, pageSize } = params;
    this.organizationSearchRequest.pageIndex = pageIndex;
    this.organizationSearchRequest.pageSize = pageSize;
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
    this.organizationSearchRequest.sortBy = sortBy;
    this.ngOnInit();
  }
  search(): void {
    this.organizationSearchRequest = {
      ...this.organizationSearchRequest,
      ...this.formSearchOrg.value,
    };
    this.organizationSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.organizationService
      .search(this.organizationSearchRequest, true)
      .subscribe((next) => {
        this.organizations = next?.body?.data as Array<IOrganization>;
        this.total = next?.body?.page?.total || 0;
      });
  }
  public getTranslate(key: string): string {
    return this.translate.instant(this.translatePath + key);
  }
  clearSearch(): void {
    this.formSearchOrg.reset();
    this.organizationSearchRequest = this.formSearchOrg.value;
    this.organizationSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.organizationSearchRequest.pageSize = PAGINATION.SIZE_DEFAULT;
    this.organizationSearchRequest.sortBy = '';
    this.ngOnInit();
  }
  create(): void {
    const base = CommonUtil.modalBase(
      UpdateOrganizationComponent,
      {
        isUpdate: false,
      },
      '80%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.organizationSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.ngOnInit();
      }
    });
  }
  update(organization: IOrganization): void {
    const base = CommonUtil.modalBase(
      UpdateOrganizationComponent,
      {
        isUpdate: true,
        organization,
      },
      '80%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.organizationSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.ngOnInit();
      }
    });
  }
  delete(organization: IOrganization): void {
    this.organization = organization;
    if (this.organization?.id) {
      this.organizationService
        .delete(this.organization.id, true)
        .subscribe((res) => {
          this.toast.success('model.organization.deleteSuccess');
          this.organizationSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
          this.ngOnInit();
        });
    }
  }
}
