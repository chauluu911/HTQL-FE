import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { Department, IDepartment } from '@shared/models/department.model';
import { IEmployeeRequest } from '@shared/models/request/employee-request.model';
import { IUserRequest } from '@shared/models/request/user-request.model';
import { TreeNode } from '@shared/models/tree.model';
import { IUser, User } from '@shared/models/user.model';
import { DepartmentService } from '@shared/services/department.service';
import { EmployeeService } from '@shared/services/employee.service';
import CommonUtil from '@shared/utils/common-utils';
import { ROUTER_UTILS } from '@shared/utils/router.utils';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-detail-department',
  templateUrl: './detail-department.component.html',
  styleUrls: ['./detail-department.component.scss'],
})
export class DetailDepartmentComponent implements OnInit {
  users: IUser[] = [];
  employeeRequest: IEmployeeRequest = {};
  advanceSearch: IUserRequest = {};
  departmentId: string[] = [];
  isCallFirstRequest = true;
  total = 0;
  loading = true;
  pageIndex = PAGINATION.PAGE_DEFAULT;
  pageSize = 9;
  pageSizeOptions = [9, 18, 27];
  isCollapsed = false;
  pathTranslateAccountType = 'model.user.service.accountType.';
  childDepartment: TreeNode[] = [];
  progeny = [];
  sortBy = '';
  searchByDepartmentId = '';
  departmentDetail: IDepartment = {};
  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private modalService: NzModalService,
    private router: Router
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.departmentId.push(params.get('id') || '');
      this.employeeRequest.departmentIds = this.departmentId;
    });
  }

  ngOnInit(): void {
    this.loadData(this.pageIndex, this.pageSize);
    this.getProgenyByDepartmentParent();
  }

  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.pageIndex, this.pageSize);
  }
  formatDate(date: any): string {
    if (!date) {
      return '-';
    }
    return moment(date).format('DD/MM/yyyy');
  }
  search(event: any): void {
    this.employeeRequest.keyword = event?.target?.value.trim();
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadData(this.pageIndex, this.pageSize, this.sortBy);
  }

  loadData(
    pageNumber: number,
    size: number,
    sortBy?: string,
    isLoading = true
  ): void {
    this.employeeRequest.pageIndex = pageNumber;
    this.employeeRequest.pageSize = size;
    this.employeeRequest.hasPageable = true;
    this.employeeRequest.sortBy = sortBy;
    this.loading = isLoading;
    this.employeeRequest.departmentIds = this.departmentId;
    if (this.searchByDepartmentId) {
      this.employeeRequest.departmentIds = [this.searchByDepartmentId];
    }
    this.departmentService
      .findById(this.employeeRequest.departmentIds)
      .subscribe(
        (response: any) => {
          const data = response?.body?.data;
          this.departmentDetail = data;
          this.loading = false;
        },
        (error: any) => {
          this.departmentDetail = {};
          this.loading = false;
        }
      );
    this.employeeService
      .search(this.employeeRequest, (isLoading = true))
      .subscribe(
        (response: any) => {
          const data = response?.body?.data;
          const page = response?.body?.page;
          if (data.length > 0) {
            data.map((user: User): any => (user.checked = false));
          }
          this.users = data;
          this.total = page.total || 0;
          this.loading = false;
        },
        (error: any) => {
          this.users = [];
          this.total = 0;
          this.loading = false;
        }
      );
  }

  handleClickNode(node: TreeNode) {
    this.searchByDepartmentId = node.id;
    this.loadData(this.pageIndex, this.pageSize);
  }
  mapEnityToNodeTree(departments: Department[]): TreeNode[] {
    return departments.map(
      (item) =>
        ({
          id: item.id,
          name: item.name,
          parentId: item.parentId,
          children: [],
        } as TreeNode)
    );
  }
  generateTree(departments: Department[]): TreeNode[] {
    const mapper = this.mapEnityToNodeTree(departments);

    // tslint:disable-next-line:no-debugger
    const idMapping = mapper.reduce((acc: { [key: string]: any }, el, i) => {
      if (el?.id) {
        // tslint:disable-next-line:no-non-null-assertion
        acc[el.id!] = i;
      }
      return acc;
    }, {});
    let root: TreeNode = {} as TreeNode;

    mapper.forEach((el) => {
      // Handle the root element
      if (this.departmentId.find((item) => item === el.id)) {
        root = el;
        return;
      }
      // Use our mapping to locate the parent element in our data array
      const parentEl = mapper[idMapping[el.parentId]];
      // Add our current el to its parent's `children` array
      parentEl.children = [...(parentEl?.children || []), el];
    });
    return [root];
  }

  format(value: any, type: string): string | any {
    if (type === 'date') {
      return CommonUtil.formatArrayToDate(value);
    } else if (type === 'status') {
      return this.translateService.instant(
        ['common', value.toLowerCase()].join('.')
      );
    }
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isCallFirstRequest) {
      this.isCallFirstRequest = false;
      return;
    }
    const { sort, filter } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    let sortBy = '';
    if (sortField && sortOrder) {
      sortBy = `${sortField}.${sortOrder === 'ascend' ? 'asc' : 'desc'}`;
    }
    this.loadData(this.pageIndex, this.pageSize, sortBy);
  }
  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadData(this.pageIndex, this.pageSize);
  }
  getLimitLength(text: string): string {
    return CommonUtil.getLimitLength(text, 25);
  }

  getTranslate(s: string): string {
    return this.translateService.instant(
      this.pathTranslateAccountType + '' + s
    );
  }
  // openAdvancedSearch(): void {
  //   const base = CommonUtil.modalBase(
  //     AdvancedSearchUserComponent,
  //     {
  //       users: this.users,
  //       advanceSearch: this.advanceSearch,
  //     },
  //     '30%'
  //   );
  //   const modal: NzModalRef = this.modalService.create(base);
  //   modal.afterClose.subscribe((result) => {
  //     if (result?.success) {
  //       this.advanceSearch = result?.userRequest;
  //       this.employeeRequest.accountType = this.advanceSearch.accountType;
  //       this.employeeRequest.status = this.advanceSearch.status;
  //       this.loadData(this.pageIndex, this.pageSize);
  //     }
  //   });
  // }

  getProgenyByDepartmentParent() {
    this.departmentService
      .getProgeny({ parentIds: [this.departmentId] })
      .subscribe(
        (response: any) => {
          this.progeny = response.body.data;
          this.childDepartment = this.generateTree(this.progeny);
        },
        (error: any) => {
          this.childDepartment = [];
        }
      );
  }
  getLabelTitle(title: string) {
    return `common.jobTitle.${title.toLowerCase()}`;
  }
  getProfile(employeeId: string) {
    this.router.navigate([ROUTER_UTILS.employee.root, employeeId]);
  }
}
