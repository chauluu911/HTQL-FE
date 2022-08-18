import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { USER_ACTIVE } from '@shared/constants/user.constant';
import { IGroupUser } from '@shared/models/group.model';
import { IUserRequest } from '@shared/models/request/user-request.model';
import { IUser } from '@shared/models/user.model';
import { GroupUserService } from '@shared/services/group-user.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UpdateGroupUserComponent } from './../update-group-user/update-group-user.component';

@Component({
  selector: 'app-group-user-detail',
  templateUrl: './group-user-detail.component.html',
  styleUrls: ['./group-user-detail.component.scss'],
})
export class GroupUserDetailComponent implements OnInit {
  groupUserId: string = '';
  userRequest: IUserRequest = {};
  loading = true;
  userActive = USER_ACTIVE;
  groupUserDetail: IGroupUser = {};
  members: IUser[] = [];
  memberTotal: number = 0;
  isCallFirstRequest = true;
  sortBy = '';
  isVisible = false;
  groupDeletePopup = { title: '', content: '', okText: '' };
  member: IUser = {};
  // Pagination
  pageIndex = PAGINATION.PAGE_DEFAULT;
  pageSize = PAGINATION.SIZE_DEFAULT;
  pageSizeOptions = PAGINATION.OPTIONS;
  constructor(
    private groupUserService: GroupUserService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private toast: ToastService,
    private modalService: NzModalService,
    private userService: UserService,
    private router: Router
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.groupUserId = params.get('id') || '';
    });
  }

  ngOnInit(): void {
    this.loadData(this.pageIndex, this.pageSize);
  }
  addMemberToGroup() {
    const base = CommonUtil.modalBase(
      UpdateGroupUserComponent,
      { groupUserId: this.groupUserId, isAddMember: true },
      '40%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.loadData(this.pageIndex, this.pageSize, this.sortBy);
      }
    });
  }
  onRemoveMember(user: IUser) {
    this.member = user;
    this.isVisible = true;
    this.groupDeletePopup = {
      title: 'model.groupUser.titleRemoveMember',
      content: 'model.groupUser.contentRemoveMember',
      okText: 'action.delete',
    };
  }
  onRemoveMemberFromGroup(result: { success: boolean }): void {
    if (result && result?.success) {
      this.groupUserService
        .removeMemberFromGroup(this.groupUserId, {
          userMemberIds: [this.member.id],
        })
        .subscribe(
          (response: any) => {
            this.loadData(this.pageIndex, this.pageSize, this.sortBy);
            this.isVisible = false;
            this.toast.success('model.groupUser.success.update');
          },
          (error: any) => {
            this.groupUserDetail = {};
            this.loading = false;
            this.toast.error('model.groupUser.error.update');
          }
        );
    } else {
      this.isVisible = false;
    }
  }
  loadData(
    pageNumber: number,
    size: number,
    sortBy?: string,
    isLoading = true
  ): void {
    this.userRequest.pageIndex = pageNumber;
    this.userRequest.pageSize = size;
    this.userRequest.hasPageable = true;
    this.userRequest.sortBy = sortBy;
    this.userRequest.groupIds = this.groupUserId ? [this.groupUserId] : [];
    this.loading = isLoading;
    this.userRequest.searchByGroup = true;
    // console.log(this.userRequest);
    this.groupUserService.find(this.groupUserId).subscribe(
      (response: any) => {
        const data = response?.body?.data;
        this.groupUserDetail = data;
        this.loading = false;
      },
      (error: any) => {
        this.groupUserDetail = {};
        this.loading = false;
      }
    );
    this.userService.search(this.userRequest, (isLoading = true)).subscribe(
      (response: any) => {
        const data = response?.body?.data;
        const page = response?.body?.page;
        this.members = data;
        this.memberTotal = page.total || 0;
        this.loading = false;
      },
      (error: any) => {
        this.members = [];
        this.memberTotal = 0;
        this.loading = false;
      }
    );
  }
  search(event: any): void {
    this.userRequest.keyword = event?.target?.value.trim();
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadData(this.pageIndex, this.pageSize, this.sortBy);
  }
  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadData(this.pageIndex, this.pageSize);
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
  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.pageIndex, this.pageSize);
  }
  getLimitLength(text: string): string {
    return CommonUtil.getLimitLength(text, 25);
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
}
