import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { ROOM_STATUS, ROOM_STATUSS } from '@shared/constants/room.constants';
import { STATUS_ACTIVE } from '@shared/constants/status.constants';
import { IRoomRequest } from '@shared/models/request/room-request';
import { IRoom, Room } from '@shared/models/room.model';
import { ToastService } from '@shared/services/helpers/toast.service';
import { RoomService } from '@shared/services/room.service';
import CommonUtil from '@shared/utils/common-utils';
import { ROUTER_UTILS } from '@shared/utils/router.utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { RoomUpdateComponent } from './room-update/room-update.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  rooms: IRoom[] = [];
  room: IRoom = new Room();
  isCallFirstRequest = true;
  loading = true;
  pageIndex = PAGINATION.PAGE_DEFAULT; // 	pageIndex , double binding
  pageSize = PAGINATION.SIZE_DEFAULT; // pageSize, double binding
  ROOM_STATUSS = ROOM_STATUSS;
  total = 0; // total record
  keyword = ''; // keyword search
  roomRequest: IRoomRequest = {};
  pathTranslate = 'model.room.';
  roomStatus = ROOM_STATUS;
  action = '';
  sortBy = '';
  isVisible = false;
  groupLockPopup = {
    title: '',
    content: '',
    interpolateParams: {},
    okText: '',
  };
  ACTION_LIST = {delete: 'delete'};
  searchForm: IRoomRequest = {};

  constructor(
    private modalService: NzModalService,
    private translateService: TranslateService,
    private roomService: RoomService,
    private toast: ToastService,
    private fb: FormBuilder,
    private route: Router
  ) {
    this.initForm();
   }

  ngOnInit(): void {
    this.loadDataRoom(this.pageIndex, this.pageSize);
  }

  initForm(): void {
    this.form = this.fb.group({
      name: '',
      location: '',
      code: '',
      status: ''
    });
  }

  getTranslate(str: string): string {
    return this.translateService.instant(this.pathTranslate + '' + str);
  }

  search(event: any): void {
    this.roomRequest.keyword = event?.target?.value.trim();
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadDataRoom(this.pageIndex, this.pageSize, this.sortBy);
  }

  loadDataRoom(pageNumber?: number, size?: number, sortBy?: string): void {
    this.roomRequest.pageIndex = pageNumber;
    this.roomRequest.pageSize = size;
    this.roomRequest.hasPageable = true;
    this.roomRequest.sortBy = sortBy;
    this.roomService.search(this.roomRequest, true).subscribe(
      (response: any) => {
        const data = response?.body?.data;
        const page = response?.body?.page;
        this.rooms = data;
        this.total = page.total || 0;
      },
      (error: any) => {
        this.rooms = [];
        this.loading = false;
      }
    );
  }

  // tạo mới Room
  create(): void {
    const base = CommonUtil.modalBase(
      RoomUpdateComponent,
      {
        isUpdate: false,
      },
      '40%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.loadDataRoom();
      }
    });
  }

  // cập nhật Room
  update(room: IRoom): void {
    const base = CommonUtil.modalBase(
      RoomUpdateComponent,
      {
        isUpdate: true,
        room,
      },
      '40%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.loadDataRoom();
      }
    });
  }

  detail(room: IRoom): void {
    this.route.navigate([ROUTER_UTILS.meeting.root, ROUTER_UTILS.room.root, room.id, ROUTER_UTILS.room.calendar]);
  }

  // Khóa và mở khóa Room
  lock(room: IRoom): void {
    this.isVisible = true;
    this.room = room;
    if (room.status === STATUS_ACTIVE) {
      this.groupLockPopup = {
        title: 'model.room.lock',
        content: 'model.room.inActiveRoomContent',
        interpolateParams: {name: `<b>${(room?.name || '')}</b>`},
        okText: 'action.lock'
      };
    } else {
      this.groupLockPopup = {
        title: 'model.room.unlock',
        content: 'model.room.activeRoomContent',
        interpolateParams: {name: `<b>${(room?.name || '')}</b>`},
        okText: 'action.unlock'
      };
    }
  }

  onLockAndUnLock(result: { success: boolean }): void {
    if (result && result?.success) {
      if (this.room.status === STATUS_ACTIVE) {
        this.roomService.inactive(this.room.id).subscribe((res: any) => {
          this.toast.success('model.room.success.inactive');
          this.loadDataRoom(this.pageIndex, this.pageSize);
          this.isVisible = false;
        });
      } else {
        this.roomService.active(this.room.id).subscribe((res: any) => {
          this.toast.success('model.room.success.active');
          this.loadDataRoom(this.pageIndex, this.pageSize);
          this.isVisible = false;
        });
      }
    } else {
      this.isVisible = false;
    }
  }

  // đánh thứ tự bản ghi
  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.pageIndex, this.pageSize);
  }

  format(value: any, type: string): string | any {
    if (type === 'status') {
      return this.translateService.instant(['common', value.toLowerCase()].join('.'));
    }
  }

  onSearch(): void {
    this.roomRequest.name = this.form.get('name')?.value;
    this.roomRequest.code = this.form.get('code')?.value;
    this.roomRequest.location = this.form.get('location')?.value;
    this.roomRequest.status = this.form.get('status')?.value;
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadDataRoom(this.pageIndex, this.pageSize);
  }

  resetSearch(): void {
    this.form.reset();
    this.roomRequest = {};
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.pageSize = PAGINATION.SIZE_DEFAULT;
    this.loadDataRoom(this.pageIndex, this.pageSize);
  }

  onCancel(): void {
    this.form.get('name')?.reset();
    this.form.get('location')?.reset();
    this.form.get('code')?.reset();
    this.form.get('status')?.reset();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isCallFirstRequest) {
      this.isCallFirstRequest = false;
      return;
    }
    const {sort, filter} = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    let sortBy = '';
    if (sortField && sortOrder) {
      sortBy = `${sortField}.${sortOrder === 'ascend' ? 'asc' : 'desc'}`;
    }
    this.loadDataRoom(this.pageIndex, this.pageSize, sortBy);
  }

  onQuerySearch(params: any): void {
    const {pageIndex, pageSize} = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadDataRoom(this.pageIndex, this.pageSize);
  }
}
