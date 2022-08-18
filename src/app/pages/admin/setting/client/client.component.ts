import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {User} from '@shared/models/user.model';
import {PAGINATION} from '@shared/constants/pagination.constants';
import {USER_STATUS} from '@shared/constants/user.constant';
import {STATUS_ACTIVE} from '@shared/constants/status.constants';
import {IRole, Role} from '@shared/models/role.model';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from '@shared/services/helpers/toast.service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {Router} from '@angular/router';
import {RoleService} from '@shared/services/role.service';
import CommonUtil from '@shared/utils/common-utils';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {ChangePasswordComponent} from '@pages/admin/setting/user/change-password/change-password.component';
import {ClientStatus, IClient} from '@shared/models/client.model';
import {ClientService} from '@shared/services/client.service';
import {IClientSearchRequest} from '@shared/models/request/clientSearch';
import {ClientUpdateComponent} from '@pages/admin/setting/client/client-update/client-update.component';
import {UserService} from '@shared/services/user.service';
import {PERMISSION_CONSTANT} from '@shared/constants/Permisstion.constant';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  translatePath = 'model.client.';
  form: FormGroup = new FormGroup({});
  keyword = '';
  isCallFirstRequest = true;
  total = 0;
  loading = true;
  CLIENT_PERMISSION = PERMISSION_CONSTANT.CLIENT;
  isVisible = false;
  pageSizeOptions = PAGINATION.OPTIONS;
  ACTIVE = STATUS_ACTIVE;
  clientSearchRequest: IClientSearchRequest = {
    keyword: '',
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    sortBy: '',
    status: '',
    roleIds: []
  };
  groupLockPopup = {
    title: '',
    content: '',
    okText: '',
    interpolateParams: {},
    callBack: () => {
    }
  }
  pathTranslateAccountType = 'model.user.service.accountType.';
  roles: IRole[] = [];
  userStatus = USER_STATUS;
  clients: IClient[] = []
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private toast: ToastService,
    private modalService: NzModalService,
    private router: Router,
    private roleService: RoleService,
    private clientService: ClientService,
    private userService: UserService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadData();
    this.onSearchRoles('');
    this.onSearchUser('');
  }

  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.clientSearchRequest.pageIndex, this.clientSearchRequest.pageSize);
  }

  initForm(): void {
    this.form = this.fb.group({
      keyword: null,
      createdByUserId: null,
      roleIds: null,
      status: null,
    });
  }

  search(): void {
    this.clientSearchRequest = {...this.clientSearchRequest, ...this.form.value};
    this.clientSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadData();
  }

  loadData(isLoading = true): void {
    this.loading = isLoading;
    this.clientService.searchClient(this.clientSearchRequest).subscribe(next => {
      this.clients = next?.body?.data as Array<IClient>;
      this.total = next?.body?.page?.total || 0;
    })
  }


  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isCallFirstRequest) {
      this.isCallFirstRequest = false;
      return;
    }
    const {sortBy} = CommonUtil.onQueryParam(params);
    this.clientSearchRequest.sortBy = sortBy;
    this.loadData();
  }

  lock(client: IClient): void {
    this.isVisible = true;
    // this.user = user;
    if (client.status === STATUS_ACTIVE) {
      this.groupLockPopup = {
        title: 'model.client.lockTitle',
        content: 'model.client.lockClientContent',
        interpolateParams: {clientName: client.name},
        okText: 'action.lock',
        callBack: () => {
          if (client.id) {
            this.clientService.inactiveClient(client.id).subscribe(next => {
              this.toast.success('model.client.lockSuccess');
              client.status = ClientStatus.INACTIVE;
              // this.loadData();
            });
          }
        }
      };
    } else {
      this.groupLockPopup = {
        title: 'model.client.unlockTitle',
        content: 'model.client.unlockClientContent',
        interpolateParams: {clientName: client.name},
        okText: 'action.unlock',
        callBack: () => {
          if (client.id) {
            this.clientService.activeClient(client.id).subscribe(next => {
              this.toast.success('model.client.unlockSuccess');
              client.status = ClientStatus.ACTIVE;
              // this.loadData();
            });
          }
        }
      };
    }
  }

  onLockAndUnLock(result: { success: boolean }): void {
    // if (result && result?.success) {
    //
    // }
    this.groupLockPopup.callBack = () => {
    };
    this.isVisible = false;
  }

  getText(value?: ClientStatus): string {
    if (value === ClientStatus.ACTIVE) {
      return this.translateService.instant('common.active');
    }
    if (value === ClientStatus.INACTIVE) {
      return this.translateService.instant(
        'common.inactive'
      );
    }
    return 'unknow';
  }

  openChangePassword(user: User): void {
    const base = CommonUtil.modalBase(
      ChangePasswordComponent,
      {
        user,
      },
      '30%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.loadData();
      }
    });
  }

  onQuerySearch(params: { pageIndex: number, pageSize: number }): void {
    const {pageIndex, pageSize} = params;
    this.clientSearchRequest.pageIndex = pageIndex;
    this.clientSearchRequest.pageSize = pageSize;
    this.loadData();
  }

  getLimitLength(text: string): string {
    return CommonUtil.getLimitLength(text, 25);
  }

  getTranslate(s: string): string {
    return this.translateService.instant(
      this.pathTranslateAccountType + '' + s
    );
  }

  openModal(client?: IClient): void {
    const base = CommonUtil.modalBase(
      ClientUpdateComponent,
      {
        client,
      },
      '50%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result?.success) {
        console.log(result)
        this.loadData();
      }
    });
  }

  onSearchRoles(keyword?: string): void {
    this.roleService
      .searchAutoComplete({keyword})
      .subscribe((res) => {
        const data = res?.body?.data as Array<Role>;
        this.roles = data || [];
      });
  }

  onSearchUser(keyword?: string): void {
    this.userService.searchUsersAutoComplete({keyword}).subscribe((res) => {
      this.users = res?.body?.data as Array<User>;
    });
  }

  resetSearch(): void {
    this.form.reset();
    this.clientSearchRequest = this.form.value;
    this.clientSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.clientSearchRequest.pageSize = PAGINATION.SIZE_DEFAULT;
    this.onSearchRoles('');
    this.loadData();
  }

}
