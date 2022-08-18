import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModalFileComponent } from '@shared/components/modal-file/modal-file.component';
import { CUSTOMER, INTERNAL } from '@shared/constants/customer.constants';
import { LOCAL_STORAGE } from '@shared/constants/local-session-cookies.constants';
import {
  NOTIFICATION_STATUS,
  NOTIFICATION_STATUS_ALL
} from '@shared/constants/notification.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { IBuilding } from '@shared/models/building.model';
import { ICustomer } from '@shared/models/customer.model';
import { IFloor } from '@shared/models/floor.model';
import { Notification } from '@shared/models/notification.model';
import { Pageable } from '@shared/models/pageable.model';
import { User } from '@shared/models/user.model';
import { ToastService } from '@shared/services/helpers/toast.service';
import { NotificationService } from '@shared/services/notification.service';
import CommonUtil from '@shared/utils/common-utils';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { LocalStorageService } from 'ngx-webstorage';
import { NotificationFilterComponent } from '../notification-filter/notification-filter.component';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
})
export class NotificationListComponent implements OnInit {
  internals: Notification[] = [];
  customers: Notification[] = [];
  notification: Notification = {};
  currentUser: User = {};

  userLevel = {
    USER_LEVEL_CENTER: false,
    USER_LEVEL_LEADER_MANAGEMENT: false,
  };

  INTERNAL = 'INTERNAL';
  CUSTOMER = 'CUSTOMER';
  NOTIFICATION_STATUS_ALL = NOTIFICATION_STATUS_ALL;

  querySearchInternal = {
    keyword: '',
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    sortBy: '',
    status: '',
    total: 0,
  };

  filterModalInternal = {
    keyword: '',
    startDate: null,
    endDate: null,
    status: null,
  };

  NOTIFICATION_STATUS = NOTIFICATION_STATUS;

  tabIndex = 0; // First Tab
  tabIndexExtras = ''; // First Tab
  tabInternal = 0;
  tabCustomer = 1;
  isCallFirstRequest = true;
  isCallSecondRequest = true;
  isVisible = false;
  isVisibleSend = false;

  public formSearchNoti: FormGroup = new FormGroup({});
  public translatePath = 'model.configuration.';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private $localStorage: LocalStorageService,
    private toast: ToastService,
    private modalService: NzModalService,
    private translate: TranslateService
  ) {
    const tabIndex =
      this.router?.getCurrentNavigation()?.extras?.state?.tabIndex;
    if (tabIndex) {
      this.tabIndexExtras = tabIndex;
    }
  }

  ngOnInit(): void {
    this.currentUser = this.$localStorage.retrieve(LOCAL_STORAGE.PROFILE);
    this.formSearchNoti = this.fb.group({
      keyword: [''],
      status: [''],
      notificationStartAt: [''],
      notificationEndAt: [''],
      expectedStartDate: [''],
      expectedendDate: [''],
      startDate: [''],
      endDate: [''],
    });
    this.userLevel.USER_LEVEL_CENTER = true;
    this.userLevel.USER_LEVEL_LEADER_MANAGEMENT = false;
    this.loadData(this.querySearchInternal);
  }

  detail(notification: Notification): void {
    if (this.userLevel.USER_LEVEL_CENTER) {
      const type = this.tabIndex === this.tabInternal ? INTERNAL : CUSTOMER;
      this.router.navigate([
        `/notification/${notification?.id}/detail/${type.toLowerCase()}`,
      ]);
    } else {
      this.router.navigate([
        `/notification/${notification?.id}/detail/${CUSTOMER.toLowerCase()}`,
      ]);
    }
  }

  create(): void {
    // if (this.userLevel.USER_LEVEL_CENTER) {
    const type = this.tabIndex === this.tabInternal ? INTERNAL : CUSTOMER;
    this.router.navigate([`/notification/create/${type.toLowerCase()}`]);
    // } else {
    //   this.router.navigate([`/notification/create/${CUSTOMER.toLowerCase()}`]);
    // }
  }

  update(notification: Notification): void {
    // if (this.userLevel.USER_LEVEL_CENTER) {
    const type = this.tabIndex === this.tabInternal ? INTERNAL : CUSTOMER;
    this.router.navigate([
      `/notification/${notification?.id}/update/${type.toLowerCase()}`,
    ]);
    // } else {
    //   this.router.navigate([
    //     `/notification/${notification?.id}/update/${CUSTOMER.toLowerCase()}`,
    //   ]);
    // }
  }

  delete(notification: Notification): void {
    this.notification = notification;
    this.isVisible = true;
  }

  onDelete(result: { success: boolean }): void {
    if (result && result?.success) {
      this.notificationService
        .delete(this.notification.id, true)
        .subscribe((res) => {
          // if (this.userLevel.USER_LEVEL_CENTER) {
          //   if (this.tabIndex === this.tabInternal) {
          this.querySearchInternal.pageIndex = PAGINATION.PAGE_DEFAULT;
          this.loadData(this.querySearchInternal);
          this.toast.success('model.notification.success.delete');
          //   } else {
          //     this.querySearchCustomer.pageIndex = PAGINATION.PAGE_DEFAULT;
          //     this.loadData(this.querySearchCustomer);
          //     this.toast.success('model.notification.success.delete');
          //   }
          // } else {
          //   this.querySearchCustomer.pageIndex = PAGINATION.PAGE_DEFAULT;
          //   this.loadData(this.querySearchCustomer);
          //   this.toast.success('model.notification.success.delete');
          // }
        });
      this.isVisible = false;
    } else {
      this.isVisible = false;
    }
  }

  send(notification: Notification): void {
    this.notification = notification;
    this.isVisibleSend = true;
  }

  onSend(result: { success: boolean }): void {
    if (result && result?.success) {
      this.notificationService
        .send(this.notification.id, true)
        .subscribe((res) => {
          // if (this.userLevel.USER_LEVEL_CENTER) {
          //   if (this.tabIndex === this.tabInternal) {
          this.loadData(this.querySearchInternal);
          this.toast.success('model.notification.success.send');
          //   } else {
          //     this.loadData(this.querySearchCustomer);
          //     this.toast.success('model.notification.success.send');
          //   }
          // } else {
          //   this.loadData(this.querySearchCustomer);
          //   this.toast.success('model.notification.success.send');
          // }
        });
      this.isVisibleSend = false;
    } else {
      this.isVisibleSend = false;
    }
  }

  search(event: any): void {
    const keyword = event?.target?.value || '';
    // if (this.userLevel.USER_LEVEL_CENTER) {
    //   if (this.tabIndex === this.tabInternal) {
    this.querySearchInternal.keyword = keyword;
    this.querySearchInternal.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadData(this.querySearchInternal);
    //   } else {
    //     this.querySearchCustomer.keyword = keyword;
    //     this.querySearchCustomer.pageIndex = PAGINATION.PAGE_DEFAULT;
    //     this.loadData(this.querySearchCustomer);
    //   }
    // } else {
    //   this.querySearchCustomer.keyword = keyword;
    //   this.querySearchCustomer.pageIndex = PAGINATION.PAGE_DEFAULT;
    //   this.loadData(this.querySearchCustomer);
    // }
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    // if (this.userLevel.USER_LEVEL_CENTER) {
    //   if (this.tabIndex === this.tabInternal) {
    this.querySearchInternal.pageIndex = pageIndex;
    this.querySearchInternal.pageSize = pageSize;
    this.loadData(this.querySearchInternal);
    //   } else {
    //     this.querySearchCustomer.pageIndex = pageIndex;
    //     this.querySearchCustomer.pageSize = pageSize;
    //     this.loadData(this.querySearchCustomer);
    //   }
    // } else {
    //   this.querySearchCustomer.pageIndex = pageIndex;
    //   this.querySearchCustomer.pageSize = pageSize;
    //   this.loadData(this.querySearchCustomer);
    // }
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
    // if (this.userLevel.USER_LEVEL_CENTER) {
    //   if (this.tabIndex === this.tabInternal) {
    this.querySearchInternal.sortBy = sortBy;
    this.loadData(this.querySearchInternal);
    // } else {
    //   this.querySearchCustomer.sortBy = sortBy;
    //   this.loadData(this.querySearchCustomer);
    // }
    // } else {
    //   this.querySearchCustomer.sortBy = sortBy;
    //   this.loadData(this.querySearchCustomer);
    // }
  }

  onChangeTab(tabIndex: number): void {
    this.tabIndex = tabIndex;
  }

  getIndex(index: number): number {
    // if (this.userLevel.USER_LEVEL_CENTER) {
    //   if (this.tabIndex === this.tabInternal) {
    return CommonUtil.getIndex(
      index,
      this.querySearchInternal.pageIndex,
      this.querySearchInternal.pageSize
    );
    //   } else {
    //     return CommonUtil.getIndex(
    //       index,
    //       this.querySearchCustomer.pageIndex,
    //       this.querySearchCustomer.pageSize
    //     );
    //   }
    // } else {
    //   return CommonUtil.getIndex(
    //     index,
    //     this.querySearchCustomer.pageIndex,
    //     this.querySearchCustomer.pageSize
    //   );
    // }
  }

  formatDate(date: any): string {
    if (!date) {
      return '-';
    }
    return moment(date).format('DD/MM/yyyy');
  }

  formatStatus(status: string): string {
    if (!status) {
      return '-';
    }
    if (status === this.NOTIFICATION_STATUS_ALL.DONE_VALUE) {
      return this.NOTIFICATION_STATUS_ALL.DONE;
    } else if (status === this.NOTIFICATION_STATUS_ALL.WAITING_VALUE) {
      return this.NOTIFICATION_STATUS_ALL.WAITING;
    } else if (status === this.NOTIFICATION_STATUS_ALL.FAILED_VALUE) {
      return this.NOTIFICATION_STATUS_ALL.FAILED;
    } else if (status === this.NOTIFICATION_STATUS_ALL.IN_PROGRESS_VALUE) {
      return this.NOTIFICATION_STATUS_ALL.IN_PROGRESS;
    }
    return '';
  }

  getColor(status: string): string {
    if (!status) {
      return '-';
    }
    if (status === this.NOTIFICATION_STATUS_ALL.DONE_VALUE) {
      return 'badge-info';
    } else if (status === this.NOTIFICATION_STATUS_ALL.WAITING_VALUE) {
      return 'badge-warning';
    } else if (status === this.NOTIFICATION_STATUS_ALL.FAILED_VALUE) {
      return 'badge-danger';
    } else if (status === this.NOTIFICATION_STATUS_ALL.IN_PROGRESS_VALUE) {
      return 'badge-success';
    }
    return '';
  }

  openModalViewFile(item: Notification): void {
    const base = CommonUtil.modalBase(
      ModalFileComponent,
      {
        files: item?.eventFiles || [],
      },
      '30%'
    );
    this.modalService.create(base);
  }

  mappingBuildings(buildings: IBuilding[]): (string | undefined)[] {
    return buildings.map((building: IBuilding) => building.code);
  }

  mappingFloors(floors: IFloor[]): (string | undefined)[] {
    if (floors) {
      return floors.map((floor: IFloor) => floor.name);
    }
    return [];
  }

  mappingOrganizations(customers: ICustomer[]): (string | undefined)[] {
    if (customers) {
      return customers.map((customer: ICustomer) => customer.name);
    }
    return [];
  }

  formatColumn(columnName: string, item: any): string {
    const val = '';
    if (columnName === 'buildings') {
      if (item?.buildings?.length > 0) {
        return this.mappingBuildings(item?.buildings).toString();
      }
      return this.translateService.instant('model.notification.allBuilding');
    } else if (columnName === 'floors') {
      if (item?.buildings?.length > 1) {
        return val;
      } else if (item?.buildings?.length === 1) {
        return this.mappingFloors(item?.floors).toString();
      }
      return val;
    } else if (columnName === 'organizations') {
      return this.mappingOrganizations(item?.organizations).toString();
    }
    return val;
  }

  getLimitLength(value = ''): string {
    return CommonUtil.getLimitLength(value);
  }

  filter(): void {
    let type = '';
    let filter;
    // if (this.userLevel.USER_LEVEL_CENTER) {
    type = INTERNAL;
    filter = { ...this.filterModalInternal };
    // ? { ...this.filterModalInternal }
    // : { ...this.filterModalCustomer };
    // } else {
    //   type = CUSTOMER;
    //   filter = { ...this.filterModalCustomer };
    // }
    const base = CommonUtil.modalBase(
      NotificationFilterComponent,
      {
        ...filter,
        isLeaderManagement: this.userLevel.USER_LEVEL_LEADER_MANAGEMENT,
        type,
      },
      '45%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.filterModalInternal = { ...result?.value };

        const startDate = new Date(result?.value?.startDate).getTime();
        const endDate = new Date(result?.value?.endDate).getTime();
        const request = {
          issuedUserId: result?.value.senderIds,
          expectedStartDate: result?.value.startDate
            ? CommonUtil.getStartOfDay(startDate)
            : null,
          expectedEndDate: result?.value.endDate
            ? CommonUtil.getEndOfDay(endDate)
            : null,
          notificationStartAt: result?.value.startDate
            ? CommonUtil.getStartOfDay(startDate)
            : null,
          notificationEndAt: result?.value.endDate
            ? CommonUtil.getEndOfDay(endDate)
            : null,
          status: result?.value.status,
          eventTargetType: type,
        };
        // if (type === INTERNAL) {
        this.querySearchInternal.keyword = '';
        this.querySearchInternal.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.loadData({
          ...this.querySearchInternal,
          ...request,
        });
      }
    });
  }

  loadData(request: any, isLoading = true): void {
    const param = { ...request };
    this.notificationService
      .search(CommonUtil.formatParams(param), isLoading)
      .subscribe(
        (response) => {
          const data = response?.body?.data as Array<Notification>;
          const page = response?.body?.page as Pageable;
          this.internals = data;
          this.querySearchInternal.total = page.total || 0;
        },
        (error) => {
          this.internals = [];
          this.querySearchInternal.total = 0;
          // }
        }
      );
  }

  onSearchForm(): void {
    const startDate = new Date(this.formSearchNoti?.value?.startDate).getTime();
    const endDate = new Date(this.formSearchNoti?.value?.endDate).getTime();
    const keyword = this.formSearchNoti.value.keyword;
    const request = {
      pageIndex: PAGINATION.PAGE_DEFAULT,
      pageSize: PAGINATION.SIZE_DEFAULT,
      keyword: keyword ? keyword.trim() : keyword,
      expectedStartDate: this.formSearchNoti?.value.startDate
        ? CommonUtil.getStartOfDay(startDate)
        : null,
      expectedEndDate: this.formSearchNoti?.value.endDate
        ? CommonUtil.getEndOfDay(endDate)
        : null,
      notificationStartAt: this.formSearchNoti?.value.startDate
        ? CommonUtil.getStartOfDay(startDate)
        : null,
      notificationEndAt: this.formSearchNoti?.value.endDate
        ? CommonUtil.getEndOfDay(endDate)
        : null,
      status: this.formSearchNoti?.value.status,
    };

    this.loadData(request);
  }

  public getTranslate(key: string): string {
    return this.translate.instant(this.translatePath + key);
  }

  onChangeDate(rangeDate: { fromDate?: Date; toDate?: Date }): void {
    this.formSearchNoti.get('startDate')?.setValue(rangeDate.fromDate);
    this.formSearchNoti.get('endDate')?.setValue(rangeDate.toDate);
  }

  onClearSearchForm(): void {
    this.formSearchNoti.reset();
    const requestPage = {
      keyword: '',
      pageIndex: PAGINATION.PAGE_DEFAULT,
      pageSize: PAGINATION.SIZE_DEFAULT,
    };
    this.loadData(requestPage);
  }
}
