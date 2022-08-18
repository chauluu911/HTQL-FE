import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_DATE_FORMAT } from '@shared/constants/common.constant';
import { LOCAL_STORAGE } from '@shared/constants/local-session-cookies.constants';
import { APPROVE_STATUSS, END_DATE_FORMAT, MEETING_STATUS, MEETING_STATUSS, MEETING_TYPE, REPEAT_TYPE } from '@shared/constants/meeting.constants';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { ROOM_STATUSS } from '@shared/constants/room.constants';
import { IMeeting, Meeting } from '@shared/models/meeting.model';
import { IMeetingRequest } from '@shared/models/request/meeting-request';
import { IRoom } from '@shared/models/room.model';
import { IUser } from '@shared/models/user.model';
import { ToastService } from '@shared/services/helpers/toast.service';
import { MeetingService } from '@shared/services/meeting.service';
import { RoomService } from '@shared/services/room.service';
import CommonUtil from '@shared/utils/common-utils';
import { ROUTER_ACTIONS, ROUTER_UTILS } from '@shared/utils/router.utils';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss'],
})
export class MeetingListComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  pathTranslate = 'model.meeting.';
  meetings: IMeeting[] = [];
  meeting: IMeeting = new Meeting();
  keyword = ''; // keyword search
  total = 0; // total record
  isCallFirstRequest = true;
  loading = true;
  meetingRequest: IMeetingRequest = {};
  currentUser: IUser;
  rooms: IRoom[] = [];
  action = '';
  sortBy = '';
  isVisible = false;
  ACTION_LIST = { cancel: 'cancel', delete: 'delete'};
  searchForm: IMeetingRequest = {};
  groupPopup = {
    title: '',
    content: '',
    interpolateParams: {},
    okText: '',
  };
  meetingTypes = MEETING_TYPE;
  repeatTypes = REPEAT_TYPE;
  pageIndex = PAGINATION.PAGE_DEFAULT; // 	pageIndex , double binding
  pageSize = PAGINATION.SIZE_DEFAULT; // pageSize, double binding
  APPROVE_STATUSS = APPROVE_STATUSS;
  ROOM_STATUSS = ROOM_STATUSS;
  END_DATE_FORMAT = END_DATE_FORMAT;
  DEFAULT_DATE_FORMAT = DEFAULT_DATE_FORMAT
  MEETING_STATUSS = MEETING_STATUSS;
  meetingStatus = MEETING_STATUS;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private meetingService: MeetingService,
    private toast: ToastService,
    private route: Router,
    private $localStorage: LocalStorageService,
    private fb: FormBuilder,
    private roomService: RoomService,
  ) {
    this.initForm();
    this.currentUser = this.$localStorage.retrieve(LOCAL_STORAGE.PROFILE);
  }

  @ViewChild('startDatePicker') startDatePicker!: NzDatePickerComponent;
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  ngOnInit(): void {
    this.loadDataMeeting(this.pageIndex, this.pageSize);
  }

  initForm(): void {
    this.form = this.fb.group({
      title: [''],
      roomId: [''],
      repeatType: [''],
      startDate: [null],
      endDate: [null],
      meetingStatus: ['']
    });
  }

  getTranslate(str: string): string {
    return this.translateService.instant(this.pathTranslate + '' + str);
  }

  // đánh thứ tự bản ghi
  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.pageIndex, this.pageSize);
  }

  loadDataMeeting(pageNumber?: number, size?: number, sortBy?: string): void {
    this.meetingRequest.pageIndex = pageNumber;
    this.meetingRequest.pageSize = size;
    this.meetingRequest.hasPageable = true;
    this.meetingRequest.sortBy = sortBy;
    this.meetingService.search(this.meetingRequest, true).subscribe(
      (response: any) => {
        const data = response?.body?.data;
        const page = response?.body?.page;
        this.meetings = data;
        this.total = page.total || 0;
      },
      (error: any) => {
        this.meetings = [];
        this.loading = false;
      }
    );
  }

  search(event: any): void {
    this.meetingRequest.keyword = event?.target?.value.trim();
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadDataMeeting(this.pageIndex, this.pageSize, this.sortBy);
  }

  cancel(isArray: boolean, meeting?: IMeeting): void {
    if (!isArray) {
      this.isVisible = true;
      this.meeting = meeting || new Meeting();
      if (!!this.meeting) {
        this.action = this.ACTION_LIST.cancel;
        this.groupPopup = {
          title: 'model.meeting.cancelMeetingTitle',
          content: 'model.meeting.cancelMeetingContent',
          interpolateParams: { name: `<b>${meeting?.title || ''}</b>` },
          okText: 'action.confirm',
        };
      }
    }
  }

  delete(isArray: boolean, meeting?: IMeeting): void {
    if (!isArray) {
      this.isVisible = true;
      this.meeting = meeting || new Meeting();
      if (!!this.meeting) {
        this.action = this.ACTION_LIST.delete;
        this.groupPopup = {
          title: 'model.meeting.deleteMeetingTitle',
          content: 'model.meeting.deleteMeetingContent',
          interpolateParams: { name: `<b>${meeting?.title || ''}</b>` },
          okText: 'action.confirm',
        };
      }
    }
  }

  actionCustom(result: { success: boolean }): void {
    if (!(result && result?.success) || !this.meeting) {
      this.isVisible = false;
      return;
    }
    if (
      this.action === this.ACTION_LIST.cancel &&
      this.meeting?.id !== undefined
    ) {
      this.meetingService.cancel(this.meeting?.id).subscribe((res) => {
        this.toast.success('model.meeting.success.cancel');
        this.loadDataMeeting(this.pageIndex, this.pageSize);
      });
      this.isVisible = false;
    } else if (
      this.action === this.ACTION_LIST.delete &&
      this.meeting?.id !== undefined
    ) {
      this.meetingService.delete(this.meeting?.id).subscribe((res) => {
        this.toast.success('model.meeting.success.delete');
        this.loadDataMeeting(this.pageIndex, this.pageSize);
      });
      this.isVisible = false;
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
    this.loadDataMeeting(this.pageIndex, this.pageSize, sortBy);
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadDataMeeting(this.pageIndex, this.pageSize);
  }

  formatStatus(value: any): string | any {
    return this.translateService.instant(['common', value.toLowerCase()].join('.'));
  }

  create(): void {
    this.router.navigate([ROUTER_UTILS.meeting.root, ROUTER_UTILS.meeting.create]);
  }

  update(meeting: IMeeting): void {
    this.route.navigate([ROUTER_UTILS.meeting.root, meeting.id, ROUTER_ACTIONS.update]);
  }

  detail(meeting: IMeeting): void {
    this.route.navigate([ROUTER_UTILS.meeting.root, meeting.id, ROUTER_ACTIONS.detail]);
  }

  enterDatePicker(event: any, nameDate: string): void {
    const date = event?.target?.value;
    if (nameDate === 'startDate') {
      if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
        return;
      } else if (!this.disabledBeforeToday(CommonUtil.newDate(date))) {
        this.form.controls[nameDate].setValue(CommonUtil.newDate(date));
        this.startDatePicker.close();
      } else {
        this.form.controls[nameDate].setValue(this.form.controls[nameDate].value);
        this.startDatePicker.close();
      }
    } else if (nameDate === 'endDate') {
      if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
        this.endDatePicker.close();
      } else if (!this.disabledBeforeStartAt(CommonUtil.newDate(date))) {
        this.form.controls[nameDate].setValue(CommonUtil.newDate(date));
        this.endDatePicker.close();
      } else {
        this.form.controls[nameDate].setValue(this.form.controls[nameDate].value);
        this.endDatePicker.close();
      }
    }
  }

  disabledBeforeToday(current: Date): boolean {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) < 0;
  }

  disabledBeforeStartAt(current: Date): boolean {

    const date = document.getElementById('startDatePicker') as HTMLInputElement;

    return differenceInCalendarDays(current, moment(date?.value, DEFAULT_DATE_FORMAT).toDate()) < 0;
  }

  onSearch(): void {
    this.meetingRequest.title = this.form.get('title')?.value || null;
    this.meetingRequest.roomId = this.form.get('roomId')?.value || null;
    this.meetingRequest.repeatType = this.form.get('repeatType')?.value || null;
    this.meetingRequest.meetingStatus = this.form.get('meetingStatus')?.value || null;
    if (this.form.get('startDate')?.value) {
      this.meetingRequest.startAt = CommonUtil.getStartOfDay(
        (this.form?.get('startDate')?.value)?.getTime()
      );
    }
    if (this.form.get('endDate')?.value) {
      this.meetingRequest.endDate = moment(new Date(this.form?.get('endDate')?.value)).format(END_DATE_FORMAT);
    }
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadDataMeeting(this.pageIndex, this.pageSize);
  }

  resetSearch(): void {
    this.form.reset();
    this.meetingRequest = {};
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.pageSize = PAGINATION.SIZE_DEFAULT;
    this.loadDataMeeting(this.pageIndex, this.pageSize);
  }

  searchRooms(keyword: any, isLoading = false): void {
    const options = {
      keyword,
      status: ROOM_STATUSS.ACTIVE
    };
    this.roomService
      .searchAutoComplete(options, isLoading)
      .subscribe((res: any) => {
        this.rooms = res.body?.data;
      });
  }

  /**
   * @description : kiểm tra startDate và EndDate có như nhau
   * @return boolean
   * @param startDate number (miliseconds)
   * @param endDate string (DD/MM/yyyy)
   */
  compareStartDateAndEndDate(startDate: number, endDate: string): boolean {
    // convert startDate và endDate qua cùng format date string
    const startDateString = moment(startDate).format(this.DEFAULT_DATE_FORMAT);
    const endDateString = moment(endDate).format(this.DEFAULT_DATE_FORMAT);
    // Check 2 date string có như nhau
    if (startDateString === endDateString) {
      return true;
    }
    return false;
  }
}
