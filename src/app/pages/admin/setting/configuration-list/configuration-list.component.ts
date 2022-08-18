import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  CONFIGURATION_STATUSES,
  CONFIGURATION_TYPES,
  PAGE_SIZE_INPUT_SEARCH,
} from '@shared/constants/configuration.constants';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { ENTITY_STATUS_CONST } from '@shared/constants/status.constants';
import { IConfiguration } from '@shared/models/configuration.model';
import { IParameterSearchRequest } from '@shared/models/request/ParameterSearchRequest';
import { Survey } from '@shared/models/survey.model';
import { IUser } from '@shared/models/user.model';
import { ConfigurationService } from '@shared/services/configuration.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ConfigurationUpdateComponent } from './configuration-update/configuration-update.component';

@Component({
  selector: 'app-configuration-list',
  templateUrl: './configuration-list.component.html',
  styleUrls: ['./configuration-list.component.scss'],
})
export class ConfigurationListComponent implements OnInit {
  public groupLockPopup = {
    title: '',
    content: '',
    okText: '',
  };
  public translatePath = 'model.configuration.';
  public parameters: IConfiguration[] = [];
  public searchRequest: IParameterSearchRequest = {
    keyword: '',
    hasPageable: true,
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
  };
  keyword = '';

  isVisible = false;
  groupPopup = {
    title: '',
    content: '',
    interpolateParams: {},
    okText: '',
    callBack: () => {},
  };

  public total = 0;
  private isCallFirstRequest = true;
  CONFIGURATION_TYPES = CONFIGURATION_TYPES;
  CONFIGURATION_STATUSES = CONFIGURATION_STATUSES;
  public formSearch: FormGroup = new FormGroup({});
  users: IUser[] = [];

  constructor(
    private translate: TranslateService,
    private configurationService: ConfigurationService,
    private modalService: NzModalService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.formSearch = this.fb.group({
      keyword: [''],
      types: [[]],
      status: [''],
      createAtFrom: [''],
      createAtTo: [''],
      createdUserIds: [[]],
    });
    this.userSearch();
  }

  public getTranslate(key: string): string {
    return this.translate.instant(this.translatePath + key);
  }

  onSearchForm(): void {
    this.searchRequest = {
      pageSize: this.searchRequest.pageSize,
      pageIndex: 1,
    } as IParameterSearchRequest;
    this.searchRequest.keyword = this.formSearch.value.keyword;
    if (this.searchRequest?.keyword) {
      this.searchRequest.keyword = this.searchRequest?.keyword.trim();
    }
    this.searchRequest.types = this.formSearch.value.types;
    this.searchRequest.status = this.formSearch.value.status;
    this.searchRequest.createdUserIds = this.formSearch.value.createdUserIds;
    if (!!this.formSearch.value.createAtFrom) {
      this.searchRequest.createAtFrom = CommonUtil.getStartOfDay(
        new Date(this.formSearch.value.createAtFrom).getTime()
      );
    }
    if (!!this.formSearch.value.createAtTo) {
      this.searchRequest.createAtTo = CommonUtil.getEndOfDay(
        new Date(this.formSearch.value.createAtTo).getTime()
      );
    }
    this.loadData();
  }

  onClearSearchForm(): void {
    this.formSearch.reset();
    this.searchRequest = {
      keyword: '',
      hasPageable: true,
      pageIndex: PAGINATION.PAGE_DEFAULT,
      pageSize: PAGINATION.SIZE_DEFAULT,
    };
    this.loadData();
  }

  userSearch(keyword?: string, pageSize = PAGE_SIZE_INPUT_SEARCH): void {
    this.userService
      .searchUsersAutoComplete({ keyword, pageSize })
      .subscribe((res) => {
        this.users = res.body?.data as Array<IUser>;
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isCallFirstRequest) {
      this.isCallFirstRequest = false;
      return;
    }
    const { sortBy } = CommonUtil.onQueryParam(params);
    this.searchRequest.sortBy = sortBy;
  }

  private loadData(): void {
    this.configurationService.search(this.searchRequest).subscribe((res) => {
      this.parameters = res?.body?.data as Array<IConfiguration>;
      this.total = res?.body?.page?.total || 0;
    });
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.searchRequest.pageIndex = pageIndex;
    this.searchRequest.pageSize = pageSize;
    this.loadData();
  }

  getIndex(index: number): number {
    return CommonUtil.getIndex(
      index,
      this.searchRequest.pageIndex,
      this.searchRequest.pageSize
    );
  }

  getLimitLength(str: string, length: number): string {
    return CommonUtil.getLimitLength(str, length);
  }

  getStartOfDay(date: number): any {
    if (date === 0) {
      return '';
    }
    return CommonUtil.getStartOfDay(date);
  }

  getColorByStatus(survey: Survey): string {
    if (survey?.status === ENTITY_STATUS_CONST.ACTIVE.code) {
      return 'badge-success';
    } else if (survey?.status === ENTITY_STATUS_CONST.INACTIVE.code) {
      return 'badge-secondary';
    }
    return '';
  }

  getStatus(paramter?: IConfiguration): string {
    if (!paramter) {
      return '';
    }
    return this.getTranslate(paramter?.status?.toLowerCase() || '');
  }

  openEdit(configuration: IConfiguration): void {
    const base = CommonUtil.modalBase(
      ConfigurationUpdateComponent,
      configuration,
      '50%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((res) => {
      if (res && res?.success) {
        this.toastService.success(this.getTranslate('success.update'));
        this.loadData();
      }
    });
  }

  openCreate(): void {
    const base = CommonUtil.modalBase(ConfigurationUpdateComponent, {}, '50%');
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((next) => {
      if (next && next?.success) {
        this.toastService.success(this.getTranslate('success.create'));
        this.loadData();
      }
    });
  }

  public getConfigurationType(type: string): string {
    const typeMap = CONFIGURATION_TYPES.find((item) => item.value === type);
    if (!typeMap) {
      return 'Type not found';
    }
    return this.translate.instant(typeMap.label);
  }

  public openConfirmChangeStatus(configuration?: IConfiguration): void {
    if (!!configuration?.id) {
      this.isVisible = true;
      if (configuration?.status === ENTITY_STATUS_CONST.ACTIVE.code) {
        this.groupPopup.content = this.translate.instant(
          this.translatePath + 'handler.messageLock',
          { code: configuration?.code || '' }
        );
        this.groupPopup.title = this.translatePath + 'handler.lock';
        this.groupPopup.okText = this.translatePath + 'handler.btnLock';
      } else {
        this.groupPopup.content = this.translate.instant(
          this.translatePath + 'handler.messageUnLock',
          { code: configuration?.code || '' }
        );
        this.groupPopup.title = this.translatePath + 'handler.unlock';
        this.groupPopup.okText = this.translatePath + 'handler.btnUnlock';
      }
      this.groupPopup.callBack = () => {
        if (configuration?.status === ENTITY_STATUS_CONST.ACTIVE.code) {
          this.configurationService
            .deActive(configuration?.id || '')
            .subscribe((res) => {
              console.log('deactive success', res);
              this.toastService.success('model.configuration.success.lock');

              this.loadData();
            });
        } else {
          this.configurationService
            .active(configuration?.id || '')
            .subscribe((res) => {
              console.log('active success', res);
              this.toastService.success('model.configuration.success.unlock');
              this.loadData();
            });
        }
      };
    }
  }

  handleConfirmInvalidBuilding(result: { success: boolean }): void {
    this.groupPopup.callBack = () => {};
    this.isVisible = false;
  }

  onChangeDate(rangeDate: { fromDate?: Date; toDate?: Date }): void {
    this.formSearch.get('createAtFrom')?.setValue(rangeDate.fromDate);
    this.formSearch.get('createAtTo')?.setValue(rangeDate.toDate);
  }
}
