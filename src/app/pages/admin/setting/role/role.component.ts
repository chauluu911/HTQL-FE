import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PAGINATION } from '@shared/constants/pagination.constants';
import {
  ROLE_ACTIVE,
  ROLE_ISROOT,
  ROLE_LEVELS,
  ROLE_STATUS
} from '@shared/constants/role.constant';
import { IRoleRequest } from '@shared/models/request/role-request.model';
import { IRole, Role } from '@shared/models/role.model';
import { ToastService } from '@shared/services/helpers/toast.service';
import { RoleService } from '@shared/services/role.service';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UpdatePermissionComponent } from './update-permission/update-permission.component';
import { UpdateRoleComponent } from './update-role/update-role.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  rolesSearch: IRole[] = [];
  pageIndex = PAGINATION.PAGE_DEFAULT; // 	pageIndex , double binding
  pageSize = PAGINATION.SIZE_DEFAULT; // pageSize, double binding
  pageSizeOptions = PAGINATION.OPTIONS; // Specify the sizeChanger options
  total = 0; // total record
  loading = true;
  sortBy = '';
  indeterminate = false; // 	nz-checkbox indeterminate status
  allChecked = false; // check all option
  keyword = ''; // keyword search
  isCallFirstRequest = true;
  roleRequest: IRoleRequest = {};
  roleActive = ROLE_ACTIVE;
  isVisible = false;
  role: IRole = {};
  groupLockPopup = {
    title: '',
    content: '',
    okText: '',
  };
  ROLE_LEVELS = ROLE_LEVELS;
  roleStatus = ROLE_STATUS;
  searchform: IRoleRequest = {};
  @ViewChild('startPicker') startPicker!: NzDatePickerComponent;
  @ViewChild('endPicker') endPicker!: NzDatePickerComponent;
  createdAt = new Date();
  isRoot = ROLE_ISROOT;
  placeHolder = new Array<string>();

  // usersSearch: IUser[] = [];
  // roleProfile: IRole[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private translateService: TranslateService,
    private roleService: RoleService,
    private toast: ToastService,
    private userService: UserService
  ) {
    this.initPlaceHolder();
    this.searchRole('');
  }

  ngOnInit(): void {
    this.loadDataRole(this.pageIndex, this.pageSize);
    this.initForm();
  }
  loadDataRole(pageNumber?: number, size?: number, sortBy?: string, isLoading = true): void {
    this.roleRequest.pageIndex = pageNumber;
    this.roleRequest.pageSize = size;
    this.roleRequest.hasPageable = true;
    this.roleRequest.sortBy = sortBy;
    this.roleService.search(this.roleRequest, (isLoading = true)).subscribe(
      (response: any) => {
        const data = response?.body?.data;
        const page = response?.body?.page;
        // console.log(data);
        if (data.length > 0) {
          data.map((role: Role): any => (role.checked = false));
        }
        this.rolesSearch = data;
        this.total = page.total || 0;
        this.loading = false;
      },
      (error) => {
        this.rolesSearch = [];
        this.total = 0;
        this.loading = true;
      }
    );
  }

  initForm(): void {
    this.form = this.fb.group({
      keyword: [this.roleRequest.keyword || null],
      isRoot: [this.roleRequest.isRoot || null],
      status: [this.roleRequest.status || null],
      createdBy: [this.roleRequest.createdBy || null],
      startCreatedAt: null,
      endCreatedAt: null,
      startLastModifiedAt: null,
      endLastModifiedAt: null,
    });
  }

  initPlaceHolder(): void {
    const from: string = this.translateService.instant('action.fromDate');
    const to: string = this.translateService.instant('action.toDate');
    this.placeHolder = [from, to];
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isCallFirstRequest) {
      this.isCallFirstRequest = false;
      return;
    }
    const { pageIndex, pageSize, sort, filter } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    if (sortField && sortOrder) {
      this.sortBy = `${sortField}.${sortOrder === 'ascend' ? 'asc' : 'desc'}`;
    } else {
      this.sortBy = '';
    }
    this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
  }

  // đánh thứ tự bản ghi
  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.pageIndex, this.pageSize);
  }

  lock(role: IRole): void {
    this.isVisible = true;
    this.role = role;
    if (role.status === ROLE_ACTIVE) {
      this.groupLockPopup = {
        title: 'model.role.titleLock',
        content: 'model.role.inActiveRoleContent',
        okText: 'action.lock',
      };
    } else {
      this.groupLockPopup = {
        title: 'model.role.titleUnLock',
        content: 'model.role.activeRoleContent',
        okText: 'action.unlock',
      };
    }
  }

  onLockAndUnLock(result: { success: boolean }): void {
    if (result && result?.success) {
      if (this.role.status === ROLE_ACTIVE) {
        this.roleService.inactive(this.role.id, true).subscribe((res) => {
          this.toast.success('model.role.success.lock');
          this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
          this.isVisible = false;
        });
      } else {
        this.roleService.active(this.role.id, true).subscribe((res) => {
          this.toast.success('model.role.success.unlock');
          this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
          this.isVisible = false;
        });
      }
    } else {
      this.isVisible = false;
    }
  }

  delete(isArray: boolean, role?: IRole): void {
    /** isArray la true => forEach users get nhung ban ghi co checked = true */
    if (isArray) {
    } else {
      const form = CommonUtil.modalConfirm(
        this.translateService,
        'model.role.deleteRoleTitle',
        'model.role.deleteRoleContent',
        { code: role?.code }
      );
      const modal = this.modalService.confirm(form);
      modal.afterClose.subscribe((result) => {
        if (result?.success) {
          if (role?.id) {
            this.roleService.delete(role.id).subscribe((res) => {
              this.toast.success('model.role.success.delete');
              this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
            });
          }
        }
      });
    }
  }

  // chưa call API, cần xử lý nốt <có thể làm giống User, call đến func loadDataRole()>
  search(): void {
    this.roleRequest.keyword = this.form.get('keyword')?.value;
    // console.log(this.roleRequest.keyword);
    this.roleRequest.isRoot = this.form.get('isRoot')?.value;
    this.roleRequest.createdBy = this.form.get('createdBy')?.value;
    this.roleRequest.status = this.form.get('status')?.value;
    const startCreatedAt = this.form.get('startCreatedAt')?.value;
    const endCreatedAt = this.form.get('endCreatedAt')?.value;
    const startLastModifiedAt = this.form.get('startLastModifiedAt')?.value;
    const endLastModifiedAt = this.form.get('endLastModifiedAt')?.value;
    if (startCreatedAt) {
      this.roleRequest.startCreatedAt = CommonUtil.getStartOfDay(
        new Date(startCreatedAt).getTime()
      );
    } else {
      this.roleRequest.startCreatedAt = null;
    }
    if (endCreatedAt) {
      this.roleRequest.endCreatedAt = CommonUtil.getEndOfDay(
        new Date(endCreatedAt).getTime()
      );
    } else {
      this.roleRequest.endCreatedAt = null;
    }
    if (startLastModifiedAt) {
      this.roleRequest.startLastModifiedAt = CommonUtil.getStartOfDay(
        new Date(startLastModifiedAt).getTime()
      );
    } else {
      this.roleRequest.startLastModifiedAt = null;
    }
    if (endLastModifiedAt) {
      this.roleRequest.endLastModifiedAt = CommonUtil.getEndOfDay(
        new Date(endLastModifiedAt).getTime()
      );
    } else {
      this.roleRequest.endLastModifiedAt = null;
    }
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
  }

  resetSearch(): void {
    this.form.reset();
    this.roleRequest = {};
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.pageSize = PAGINATION.SIZE_DEFAULT;
    this.sortBy = '';
    this.searchRole('');
    this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
  }

  // tạo mới Role
  create(): void {
    const base = CommonUtil.modalBase(
      UpdateRoleComponent,
      {
        isUpdate: false,
      },
      '40%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
      }
    });
  }

  update(role: IRole): void {
    const base = CommonUtil.modalBase(
      UpdateRoleComponent,
      {
        isUpdate: true,
        role,
      },
      '40%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
      }
    });
  }

  updatePermission(role: IRole): void {
    const base = CommonUtil.modalBase(UpdatePermissionComponent, {
      isUpdate: true,
      role,
    });
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
      }
    });
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
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

  getLimitLength(text: string): string {
    return CommonUtil.getLimitLength(text, 20);
  }

  formatLevel(str: string): any {
    if (!str) {
      return 'model.role.updating';
    }
    if (str === this.ROLE_LEVELS.CENTER) {
      return this.ROLE_LEVELS.CENTER_TITLE;
    } else if (str === this.ROLE_LEVELS.BUILDING) {
      return this.ROLE_LEVELS.BUILDING_TITLE;
    } else if (str === this.ROLE_LEVELS.CUSTOMER) {
      return this.ROLE_LEVELS.CUSTOMER_TITLE;
    }
  }

  searchRole(keyword: string): void {
    this.roleService
      .searchAutoComplete({
        keyword: keyword.trim(),
        pageIndex: PAGINATION.PAGE_DEFAULT,
        pageSize: PAGINATION.SIZE_DEFAULT,
      })
      .subscribe((res: any) => {
        this.rolesSearch = res.body?.data as Array<Role>;
        // console.log(this.rolesSearch);
      });
  }

  mappingRoles(roles: IRole[]): (string | undefined)[] {
    return roles.map((role: IRole) => role.name) || [];
  }

  selectAll(controls: string, value: any[]): void {
    const formControl = this.form.controls[controls];
    if (formControl.value?.length === value.length) {
      formControl.setValue([]);
    } else {
      if (controls === 'createdBy') {
        formControl.setValue(this.mappingRoles(value));
      }
    }
  }

  onChangeCreatedDate(rangeDate: { fromDate?: Date; toDate?: Date }): void {
    this.form.get('startCreatedAt')?.setValue(rangeDate.fromDate);
    this.form.get('endCreatedAt')?.setValue(rangeDate.toDate);
  }

  onChangeLastModifieddDate(rangeDate: {
    fromDate?: Date;
    toDate?: Date;
  }): void {
    this.form.get('startLastModifiedAt')?.setValue(rangeDate.fromDate);
    this.form.get('endLastModifiedAt')?.setValue(rangeDate.toDate);
  }
}
