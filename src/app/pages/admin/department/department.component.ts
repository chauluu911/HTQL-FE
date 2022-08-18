import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  DEPARTMENT_ACTIVE,
  DEPARTMENT_STATUS
} from '@shared/constants/department.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { Department, IDepartment } from '@shared/models/department.model';
import { IDepartmentRequest } from '@shared/models/request/department-request.model';
import { DepartmentService } from '@shared/services/department.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { ROUTER_ACTIONS, ROUTER_UTILS } from '@shared/utils/router.utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AdvancedSearchDepartmentComponent } from './advanced-search-department/advanced-search-department.component';
import { UpdateDepartmentComponent } from './update-department/update-department.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
})
export class DepartmentComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  departments: IDepartment[] = [];
  department: IDepartment = {};
  keyword: string = '';
  isCallFirstRequest = true;
  departmentRequest: IDepartmentRequest = {};
  total = 0;
  loading = true;
  isVisible = false;
  departmentActive = DEPARTMENT_ACTIVE;
  pageIndex = PAGINATION.PAGE_DEFAULT;
  pageSize = PAGINATION.SIZE_DEFAULT;
  pageSizeOptions = PAGINATION.OPTIONS;
  sortBy = '';
  groupLockPopup = {
    title: '',
    content: '',
    okText: '',
  };

  departmentStatus = DEPARTMENT_STATUS;

  searchform: IDepartmentRequest = {};

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private translateService: TranslateService,
    private toast: ToastService,
    private modalService: NzModalService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadDataDepartment(this.pageIndex, this.pageSize);
    this.initForm();
  }

  loadDataDepartment(
    pageNumber?: number,
    size?: number,
    sortBy?: string
  ): void {
    this.departmentRequest.pageIndex = pageNumber;
    this.departmentRequest.pageSize = size;
    this.departmentRequest.hasPageable = true;
    this.departmentRequest.sortBy = sortBy;
    this.departmentService.search(this.departmentRequest, true).subscribe(
      (response: any) => {
        const data = response?.body?.data;
        const page = response?.body?.page;
        if (data.length > 0) {
          data.map(
            (department: Department): any => (department.checked = false)
          );
        }
        this.departments = data;
        this.total = page.total || 0;
      },
      (error) => {
        this.departments = [];
        this.total = 0;
      }
    );
  }

  initForm(): void {
    this.form = this.fb.group({
      keyword: [this.departmentRequest.keyword || null],
      status: [this.departmentRequest.status || null],
      startCreatedAt: null,
      endCreatedAt: null,
      startLastModifiedAt: null,
      endLastModifiedAt: null,
    });
  }

  search(): void {
    this.departmentRequest.keyword = this.form.get('keyword')?.value;
    this.departmentRequest.status = this.form.get('status')?.value;
    const startCreatedAt = this.form.get('startCreatedAt')?.value;
    const endCreatedAt = this.form.get('endCreatedAt')?.value;
    const startLastModifiedAt = this.form.get('startLastModifiedAt')?.value;
    const endLastModifiedAt = this.form.get('endLastModifiedAt')?.value;
    if (startCreatedAt) {
      this.departmentRequest.startCreatedAt = CommonUtil.getStartOfDay(
        new Date(startCreatedAt).getTime()
      );
    } else {
      this.departmentRequest.startCreatedAt = null;
    }
    if (endCreatedAt) {
      this.departmentRequest.endCreatedAt = CommonUtil.getEndOfDay(
        new Date(endCreatedAt).getTime()
      );
    } else {
      this.departmentRequest.endCreatedAt = null;
    }
    if (startLastModifiedAt) {
      this.departmentRequest.startLastModifiedAt = CommonUtil.getStartOfDay(
        new Date(startLastModifiedAt).getTime()
      );
    } else {
      this.departmentRequest.startLastModifiedAt = null;
    }
    if (endLastModifiedAt) {
      this.departmentRequest.endLastModifiedAt = CommonUtil.getEndOfDay(
        new Date(endLastModifiedAt).getTime()
      );
    } else {
      this.departmentRequest.endLastModifiedAt = null;
    }
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadDataDepartment(this.pageIndex, this.pageSize, this.sortBy);
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
    this.loadDataDepartment(this.pageIndex, this.pageSize, this.sortBy);
  }

  // đánh thứ tự bản ghi
  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.pageIndex, this.pageSize);
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

  detaiDepartment(deparment: IDepartment): void {
    this.router.navigate([
      ROUTER_UTILS.department.root,
      deparment.id,
      ROUTER_ACTIONS.detail,
    ]);
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadDataDepartment(this.pageIndex, this.pageSize, this.sortBy);
  }

  update(department: IDepartment): void {
    const base = CommonUtil.modalBase(
      UpdateDepartmentComponent,
      {
        isUpdate: true,
        department,
      },
      '40%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.loadDataDepartment(this.pageIndex, this.pageSize, this.sortBy);
      }
    });
  }

  create(): void {
    const base = CommonUtil.modalBase(
      UpdateDepartmentComponent,
      {
        isUpdate: false,
      },
      '40%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.loadDataDepartment(this.pageIndex, this.pageSize, this.sortBy);
      }
    });
  }

  openAdvancedSearch(): void {
    const base = CommonUtil.modalBase(
      AdvancedSearchDepartmentComponent,
      {
        departments: this.departments,
        departmentRequest: this.searchform,
      },
      '35%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result?.success) {
        this.departmentRequest.startAt = result?.data?.createdAt;
        this.departmentRequest.endAt = result?.data?.lastModifiedAt;
        this.searchform = { ...this.departmentRequest };
        if (result?.data?.createdAt) {
          this.departmentRequest.startAt = CommonUtil.getStartOfDay(
            (result?.data?.createdAt as Date)?.getTime()
          );
        }
        if (result?.data?.lastModifiedAt) {
          this.departmentRequest.endAt = CommonUtil.getEndOfDay(
            (result?.data?.lastModifiedAt as Date)?.getTime()
          );
        }
        this.loadDataDepartment(this.pageIndex, this.pageSize);
      }
    });
  }

  lock(depatment: IDepartment): void {
    this.isVisible = true;
    this.department = depatment;
    console.log(depatment.status);

    if (depatment.status === DEPARTMENT_ACTIVE) {
      this.groupLockPopup = {
        title: 'model.department.titleLock',
        content: 'model.department.inActiveRoleContent',
        okText: 'action.lock',
      };
    } else {
      this.groupLockPopup = {
        title: 'model.department.titleUnLock',
        content: 'model.department.activeRoleContent',
        okText: 'action.unlock',
      };
    }
  }

  onLockAndUnLock(result: { success: boolean }): void {
    if (result && result?.success) {
      if (this.department.status === DEPARTMENT_ACTIVE) {
        this.departmentService
          .inActive(this.department.id, true)
          .subscribe((res) => {
            this.toast.success('model.role.success.lock');
            this.loadDataDepartment(this.pageIndex, this.pageSize, this.sortBy);
            this.isVisible = false;
          });
      } else {
        this.departmentService
          .active(this.department.id, true)
          .subscribe((res) => {
            this.toast.success('model.role.success.unlock');
            this.loadDataDepartment(this.pageIndex, this.pageSize, this.sortBy);
            this.isVisible = false;
          });
      }
    } else {
      this.isVisible = false;
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

  resetSearch(): void {
    this.form.reset();
    this.departmentRequest = {};
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.pageSize = PAGINATION.SIZE_DEFAULT;
    this.sortBy = '';
    this.loadDataDepartment(this.pageIndex, this.pageSize, this.sortBy);
  }
}
