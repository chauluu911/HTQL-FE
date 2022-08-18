import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { IGroupUser } from '@shared/models/group.model';
import { IGroupUserRequest } from '@shared/models/request/group-user-request.model';
import { GroupUserService } from '@shared/services/group-user.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { ROUTER_ACTIONS, ROUTER_UTILS } from '@shared/utils/router.utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { UpdateGroupUserComponent } from './update-group-user/update-group-user.component';

@Component({
  selector: 'app-group-user',
  templateUrl: './group-user.component.html',
  styleUrls: ['./group-user.component.scss'],
})
export class GroupUserComponent implements OnInit {
  constructor(
    private groupUserService: GroupUserService,
    private modalService: NzModalService,
    private toast: ToastService,
    private router: Router
  ) {}
  groupDeletePopup = { title: '', content: '', okText: '' };
  groupUsers: IGroupUser[] = [];
  groupUser: IGroupUser = {};
  keyword = '';
  groupUserRequest: IGroupUserRequest = {};
  loading = true;
  total = 0;
  isVisible = false;
  // Pagination
  pageIndex = PAGINATION.PAGE_DEFAULT;
  pageSize = 12;
  pageSizeOptions = [12, 24, 48];
  ngOnInit(): void {
    this.loadData(this.pageIndex, this.pageSize);
  }
  // Filter
  search(event: any): void {
    this.groupUserRequest.keyword = event?.target?.value.trim();
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
    this.groupUserRequest.pageIndex = pageNumber;
    this.groupUserRequest.pageSize = size;
    this.groupUserRequest.sortBy = sortBy;
    this.loading = isLoading;
    this.groupUserService
      .search(this.groupUserRequest, (isLoading = true))
      .subscribe(
        (response: any) => {
          const data = response?.body?.data;
          const page = response?.body?.page;
          this.groupUsers = data;
          this.total = page.total || 0;
          this.loading = false;
        },
        (error: any) => {
          this.groupUsers = [];
          this.total = 0;
          this.loading = false;
        }
      );
  }
  getFirstLetter(name: string): string {
    return name.charAt(0).toLocaleUpperCase().toString();
  }
  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadData(this.pageIndex, this.pageSize);
  }
  onConfirmRemoveGroup(groupUser: IGroupUser) {
    this.groupUser = groupUser;
    this.isVisible = true;
    this.groupDeletePopup = {
      title: 'model.groupUser.titleRemoveGroup',
      content: 'model.groupUser.contentRemoveGroup',
      okText: 'action.delete',
    };
  }
  onRemoveGroup(result: { success: boolean }): void {
    if (result && result?.success) {
      this.groupUserService.remove(this.groupUser.id).subscribe(
        (response: any) => {
          this.loadData(this.pageIndex, this.pageSize);
          this.isVisible = false;
          this.toast.success('model.groupUser.success.delete');
        },
        (error: any) => {
          this.loading = false;
          this.toast.error('model.groupUser.error.delete');
        }
      );
    } else {
      this.isVisible = false;
    }
  }
  update(groupUser: IGroupUser): void {
    const base = CommonUtil.modalBase(
      UpdateGroupUserComponent,
      {
        isUpdate: true,
        groupUser,
      },
      '40%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.loadData(this.pageIndex, this.pageSize);
      }
    });
  }
  create(): void {
    const base = CommonUtil.modalBase(
      UpdateGroupUserComponent,
      {
        isUpdate: false,
      },
      '40%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.loadData(this.pageIndex, this.pageSize);
      }
    });
  }
  detail(groupUser: IGroupUser): void {
    this.router.navigate([
      ROUTER_UTILS.setting.root,
      ROUTER_UTILS.setting.groupUser,
      groupUser.id,
      ROUTER_ACTIONS.detail,
    ]);
  }
}
