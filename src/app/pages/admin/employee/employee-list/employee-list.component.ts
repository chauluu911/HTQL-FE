import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { Employee, IEmployee } from '@shared/models/employee.model';
import { EmployeeRequest } from '@shared/models/request/employee-request.model';
import { AuthService } from '@shared/services/auth/auth.service';
import { EmployeeService } from '@shared/services/employee.service';
import { FileService } from '@shared/services/file.service';
import CommonUtil from '@shared/utils/common-utils';
import { ResizedEvent } from 'angular-resize-event';
import * as moment from 'moment';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  constructor(
    private employeeService: EmployeeService,
    private fileService: FileService,
    private authService: AuthService
  ) {}
  @ViewChild('body')
  body!: ElementRef;
  employees: IEmployee[] = [];
  employee: IEmployee = {};
  keyword = '';
  employeeRequest: EmployeeRequest = {};
  width = 0;
  height = 0;
  change = false;
  absolute = false;
  isFullHD = false;

  total = 0;
  loading = true;
  isVisible = false;
  // Pagination
  pageIndex = PAGINATION.PAGE_DEFAULT;
  pageSize = 12;
  pageSizeOptions = [12, 24, 48];

  active = false;
  ngOnInit(): void {
    this.loadData(this.pageIndex, this.pageSize);
  }
  // Get serial number
  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.pageIndex, this.pageSize);
  }
  // Filter
  search(event: any): void {
    this.employeeRequest.keyword = event?.target?.value.trim();
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadData(this.pageIndex, this.pageSize);
  }
  // Get Data
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
    this.employeeService
      .search(this.employeeRequest, (isLoading = true))
      .subscribe(
        (response: any) => {
          const data = response?.body?.data;
          const page = response?.body?.page;
          if (data.length > 0) {
            data.map((employee: Employee): any => (employee.checked = false));
          }
          this.employees = data;
          this.total = page.total || 0;
          this.loading = false;
        },
        (error: any) => {
          this.employees = [];
          this.total = 0;
          this.loading = false;
        }
      );
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadData(this.pageIndex, this.pageSize);
  }

  getLimitLength(text: string, num?: number): string {
    return CommonUtil.getLimitLength(text, num ? num : 25);
  }

  formatDate(date: any): string {
    if (!date) {
      return '-';
    }
    return moment(date).format('DD/MM/yyyy');
  }
  getFirstLetter(name: string): string {
    return name.charAt(0).toLocaleUpperCase().toString();
  }

  getResource(avatarFileUrl: string): string {
    return this.fileService.getFileResource(avatarFileUrl);
  }

  onResized(event: ResizedEvent) {
    this.width = event.newRect.width;
    this.height = event.newRect.height;
    if (this.width <= 940) {
      this.change = true;
    } else {
      this.change = false;
    }

    if (this.width <= 804) {
      this.absolute = true;
    } else {
      this.absolute = false;
    }

    if (this.width >= 1494) {
      this.isFullHD = true;
    } else {
      this.isFullHD = false;
    }
  }
}
