import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ATTENDEE_TYPE } from '@shared/constants/attendee-type.constant';
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT, MAX_DAY_IN_MONTH, MAX_HOUR_IN_DAY, MAX_MINUTE_IN_HOUR, MIN_DAY_IN_MONTH } from '@shared/constants/common.constant';
import {
  APPROVE_STATUSS,
  DAY_OF_WEEK,
  DEFAULT_DURATION_TIME,
  DEFAULT_MEASURE,
  DEFAULT_WEEK_OF_MONTH,
  END_DATE_FORMAT,
  FIRST_OPTION,
  MAX_MEETING_HOUR,
  MEETING_TYPE,
  MEETING_TYPES,
  MIN_MEETING_HOUR,
  MONTH_OF_YEAR,
  NOT_REPEAT,
  OFFLINE,
  ONLINE,
  REPEAT_TYPE,
  REPEAT_TYPES, SELECT_OPTIONS, WEEK_OF_MONTH,
  WEEK_OPTION
} from '@shared/constants/meeting.constants';
import { ROOM_STATUSS } from '@shared/constants/room.constants';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { IMeetingAttendee } from '@shared/models/meeting-attendee.model';
import { IMeeting } from '@shared/models/meeting.model';
import {
  IMeetingUpdateRequest,
  MeetingUpdateRequest
} from '@shared/models/request/meeting-update-request.model';
import { IUserRequest } from '@shared/models/request/user-request.model';
import { IRoom } from '@shared/models/room.model';
import { IUser } from '@shared/models/user.model';
import { ToastService } from '@shared/services/helpers/toast.service';
import { MeetingService } from '@shared/services/meeting.service';
import { RoomService } from '@shared/services/room.service';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import { ROUTER_ACTIONS, ROUTER_UTILS } from '@shared/utils/router.utils';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-meeting-update',
  templateUrl: './meeting-update.component.html',
  styleUrls: ['./meeting-update.component.scss'],
})
export class MeetingUpdateComponent implements OnInit {
  id = '';
  action = '';
  isUpdate = false;
  isDetail = false;
  meetingUpdateRequest: IMeetingUpdateRequest = {};
  meeting: IMeeting = {};
  form: FormGroup = new FormGroup({});
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  pathTranslate = 'model.meeting.';
  startDate = moment().toDate();
  startTime = '';
  finishTime = '';
  currentDate = moment().toDate();
  requiredUsers: IUser[] = [];
  optionalUsers: IUser[] = [];
  presiders: IUser[] = [];
  rooms: IRoom[] = [];
  dayOfWeekList: string[] = [];
  dayOfWeek!: string;
  currentMonth = '';
  currentDay!: number;
  currentDayOfWeek = '';
  startTimeBlocks: string[] = [];
  finishTimeBlocks: string[] = [];
  userRequest: IUserRequest = {};
  defaultMeasure = DEFAULT_MEASURE;
  defaultWeekOfMonth = DEFAULT_WEEK_OF_MONTH;
  repeatTypes = REPEAT_TYPE;
  meetingTypes = MEETING_TYPE;
  APPROVE_STATUSS = APPROVE_STATUSS;
  repeatType = NOT_REPEAT;
  meetingType = OFFLINE;
  monthOfYears = MONTH_OF_YEAR;
  weekOfMonths = WEEK_OF_MONTH;
  dayOfWeeks = DAY_OF_WEEK;
  REPEAT_TYPES = REPEAT_TYPES;
  SELECT_OPTIONS = SELECT_OPTIONS;
  radioValue = FIRST_OPTION;
  weekOptions = [...WEEK_OPTION];
  ATTENDEE_TYPE = ATTENDEE_TYPE;
  MEETING_TYPES = MEETING_TYPES;
  durationTime = DEFAULT_DURATION_TIME;
  ROOM_STATUSS = ROOM_STATUSS
  minMeetingHour = MIN_MEETING_HOUR;
  maxMeetingHour = MAX_MEETING_HOUR;
  maxHour = MAX_HOUR_IN_DAY;
  maxMinute = MAX_MINUTE_IN_HOUR;
  minDay = MIN_DAY_IN_MONTH;
  maxDay = MAX_DAY_IN_MONTH;
  ROUTER_ACTIONS = ROUTER_ACTIONS;
  DEFAULT_TIME_FORMAT = DEFAULT_TIME_FORMAT;
  END_DATE_FORMAT = END_DATE_FORMAT;
  DEFAULT_DATE_FORMAT = DEFAULT_DATE_FORMAT;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private roomService: RoomService,
    private meetingService: MeetingService,
    private toast: ToastService,
    private userService: UserService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.data.subscribe((res) => {
      this.action = res.action;
    });
    this.activatedRoute.paramMap.subscribe((res) => {
      this.id = res.get('id') || '';
    });

  }

  @ViewChild('startDatePicker') startDatePicker!: NzDatePickerComponent;

  @ViewChild('finishDatePicker') finishDatePicker!: NzDatePickerComponent;

  ngOnInit(): void {
    this.initData();
    if (!!this.id) {
      if (this.action.includes('detail')) {
        this.isDetail = true;
      } else {
        this.isUpdate = true;
      }
      this.initForm();
      this.initMeeting(this.id);
    } else {
      this.initForm();
    }
    this.valueChangesForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      title: [
        {
          value: '',
          disabled: this.isDetail,
        },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.TITLE_MAX_LENGTH.MAX),
        ],
      ],
      requiredUserIds: [
        {
          value: [],
          disabled: this.isDetail,
        },
        [Validators.required],
      ],
      optionalUserIds: [
        {
          value: [],
          disabled: this.isDetail,
        },
      ],
      presiderId: [
        {
          value: '',
          disabled: this.isDetail,
        },
      ],
      startDate: [
        {
          value: moment().toDate(),
          disabled: this.isDetail,
        },
        [Validators.required],
      ],
      startTime: [
        {
          value: this.startTime,
          disabled: this.isDetail,
        },
        [Validators.required],
      ],
      finishDate: [
        {
          value: moment().toDate(),
          disabled: true
        },
        [Validators.required],
      ],
      finishTime: [
        {
          value: this.finishTime,
          disabled: this.isDetail,
        },
        [Validators.required],
      ],
      repeatType: [
        {
          value: REPEAT_TYPES.NOT_REPEAT,
          disabled: this.isDetail,
        },
        [Validators.required],
      ],
      repeatMeasure: [
        {
          value: this.defaultMeasure,
          disabled: this.isDetail,
        },
      ],
      monthOfYear: [
        {
          value: this.currentMonth,
          disabled: this.isDetail,
        },
      ],
      dayOfMonth: [
        {
          value: this.currentDay,
          disabled: this.isDetail,
        },
      ],
      weekOfMonth: [
        {
          value: this.defaultWeekOfMonth,
          disabled: this.isDetail,
        },
      ],
      dayOfWeek: [
        {
          value: this.currentDayOfWeek,
          disabled: this.isDetail,
        },
      ],
      endDate: [
        {
          value: moment().toDate(),
          disabled: this.isDetail,
        },
        [Validators.required],
      ],
      meetingType: [
        {
          value: MEETING_TYPES.OFFLINE,
          disabled: this.isUpdate || this.isDetail,
        },
        [Validators.required],
      ],
      link: [
        {
          value: '',
          disabled: this.isDetail,
        },
        [Validators.maxLength(LENGTH_VALIDATOR.CONTENT_MAX_LENGTH.MAX)],
      ],
      roomId: [
        {
          value: '',
          disabled: this.isDetail,
        },
        [Validators.required],
      ],
      description: [
        {
          value: '',
          disabled: this.isDetail,
        },
        [Validators.maxLength(LENGTH_VALIDATOR.DESC_MAX_LENGTH.MAX)],
      ],
    });
  }

  initMeeting(id: string): void {
    this.meetingService.findByMeetingId(id, true).subscribe((response: any) => {
      this.meeting = response.body?.data;
      this.handleMapMeetingToForm(this.meeting);
      if (this.meeting.meetingAttendees !== undefined && this.meeting.meetingAttendees.length > 0) {
        this.handerAttendeeToForm(this.meeting.meetingAttendees);
      }
      if (this.meeting.dayOfWeekList !== undefined && this.meeting.dayOfWeekList.length > 0) {
        this.handlerDayOfWeekListToForm(this.meeting.dayOfWeekList);
      }
      if (this.meeting.presiderId) {
        this.handlePresierToForm(this.meeting.presiderId);
      }
    });
  }

  handlePresierToForm(presiderId: string): void {
    // get presider đổ vào select box
    this.userService.find(presiderId).subscribe(
      (response: any) => {
         const presider = response?.body.data;
         this.presiders = [];
         this.presiders.push(presider);
      }
    );
    this.form.get('presiderId')?.setValue(presiderId || '');
  }

  handleMapMeetingToForm(meeting: IMeeting): void {
    this.form.get('title')?.setValue(meeting?.title || '');
    this.form.get('startDate')?.setValue(meeting?.startAt || null);
    this.form.get('finishDate')?.setValue(meeting?.finishAt || null);
    this.form.get('repeatType')?.setValue(meeting?.repeatType || '');
    this.form.get('repeatMeasure')?.setValue(meeting?.repeatMeasure || this.defaultMeasure);
    this.form.get('monthOfYear')?.setValue(meeting?.monthOfYear || this.currentMonth);
    this.form.get('dayOfMonth')?.setValue(meeting?.dayOfMonth || this.currentDay);
    this.form.get('weekOfMonth')?.setValue(meeting?.weekOfMonth || this.defaultWeekOfMonth);
    this.form.get('meetingType')?.setValue(meeting?.meetingType || '');
    this.form.get('roomId')?.setValue(meeting?.roomId || '');
    this.form.get('link')?.setValue(meeting?.link || '');
    this.form.get('description')?.setValue(meeting?.description || '');

    if (meeting?.startAt !== undefined) {
      this.form.get('startTime')?.setValue(moment(meeting?.startAt).format(DEFAULT_TIME_FORMAT));
    } else {
      this.form.get('startTime')?.setValue(null);
    }
    if (meeting?.finishAt !== undefined) {
      this.form.get('finishTime')?.setValue(moment(meeting?.finishAt).format(DEFAULT_TIME_FORMAT));
    } else {
      this.form.get('finishTime')?.setValue(null);
    }
    if (meeting?.endDate !== undefined) {
      this.form.get('endDate')?.setValue(moment(new Date(meeting?.endDate)).toDate());
    } else {
      this.form.get('endDate')?.setValue(null);
    }

    // Change select option
    if (meeting?.dayOfMonth === undefined) {
      this.radioValue = SELECT_OPTIONS.SECOND_OPTION;
    }
    // Init repeateType
    this.repeatType = meeting?.repeatType || '';
  }

  initData(): void {
    this.loadDataUsers();
    this.loadDataRooms(true);
    this.initTimeData();
  }

  initTimeData(): void {
    this.startTime = this.getRoundCurrentTime(this.durationTime);
    this.changeStartTime(this.startTime);
    this.startTimeBlocks = this.getBlockStartTimes(this.durationTime);
    this.getCurrentMonth();
    this.getCurrentDay();
    this.getCurrentDayOfWeek();
  }

  loadDataUsers(): void {
    this.userService.searchUsersAutoComplete().subscribe(
      (response: any) => {
        const data = response?.body?.data;
        this.requiredUsers = data;
        this.optionalUsers = data;
        this.presiders = data;
      }
    );
  }

  searchPresider(keyword: any, isLoading = false): void {
    const options = {
      keyword
    };
    this.userService
      .searchUsersAutoComplete(options, isLoading)
      .subscribe((res: any) => {
        this.presiders = res.body?.data;
      });
  }

  searchRequiredUsers(keyword: any, isLoading = false): void {
    const options = {
      keyword
    };
    this.userService
      .searchUsersAutoComplete(options, isLoading)
      .subscribe((res: any) => {
        this.requiredUsers = res.body?.data;
        const optinalUserIds = this.form?.get('optionalUserIds')?.value;
        if (optinalUserIds !== undefined && optinalUserIds.length > 0) {
          this.requiredUsers = this.requiredUsers.filter(item => !optinalUserIds.includes(item.id));
        }
      });
  }

  searchOptionalUsers(keyword: any, isLoading = false): void {
    const options = {
      keyword
    };
    this.userService
      .searchUsersAutoComplete(options, isLoading)
      .subscribe((res: any) => {
        this.optionalUsers = res.body?.data;
        const requiredUserIds = this.form?.get('requiredUserIds')?.value;
        if (requiredUserIds !== undefined && requiredUserIds.length > 0) {
          this.optionalUsers = this.optionalUsers.filter(item => !requiredUserIds.includes(item.id));

        }
      });
  }

  loadDataRooms(isLoading = false): void {
    const options = {
      status: ROOM_STATUSS.ACTIVE
    };
    this.roomService.searchAutoComplete(options, isLoading)
    .subscribe(
      (response: any) => {
        const data = response?.body?.data;
        this.rooms = data;
      }
    );
  }

  getTranslate(str: string): string {
    return this.translateService.instant(this.pathTranslate + '' + str);
  }

  disabledBeforeToday(current: Date): boolean {
    // Can not select days after today
    return differenceInCalendarDays(current, moment().toDate()) < 0;
  }

  disabledBeforeStartAt(current: Date): boolean {
    const date = document.getElementById('startDatePicker') as HTMLInputElement;

    return (
      differenceInCalendarDays(
        current,
        moment(date?.value, DEFAULT_DATE_FORMAT).toDate()
      ) < 0
    );
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
        this.form.controls[nameDate].setValue(
          this.form.controls[nameDate].value
        );
        this.startDatePicker.close();
      }
    } else if (nameDate === 'finishDate') {
      if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
        this.finishDatePicker.close();
      } else if (!this.disabledBeforeStartAt(CommonUtil.newDate(date))) {
        this.form.controls[nameDate].setValue(CommonUtil.newDate(date));
        this.finishDatePicker.close();
      } else {
        this.form.controls[nameDate].setValue(
          this.form.controls[nameDate].value
        );
        this.finishDatePicker.close();
      }
    } else if (nameDate === 'endDate') {
      if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
        this.finishDatePicker.close();
      } else if (!this.disabledBeforeStartAt(CommonUtil.newDate(date))) {
        this.form.controls[nameDate].setValue(CommonUtil.newDate(date));
        this.finishDatePicker.close();
      } else {
        this.form.controls[nameDate].setValue(
          this.form.controls[nameDate].value
        );
        this.finishDatePicker.close();
      }
    }
  }

  changeWeekOptions(updatedWeekOptions: any): void {
    const checkedWeeks = updatedWeekOptions.filter(
      (item: { checked: boolean }) => item.checked === true
    );
    if (checkedWeeks.length === 1) {
      for (const week of checkedWeeks) {
        week.disabled = true;
      }
    } else if (checkedWeeks.length > 1) {
      for (const week of checkedWeeks) {
        if (week.disabled === true) {
          week.disabled = false;
        }
      }
    }
  }

  valueChangesForm(): void {
    this.form?.controls.startDate?.valueChanges.subscribe((value) => {
      if (!!value) {
        this.changeStartDate();
      }
    });
  }

  getTitle(): string {
    if (this.isDetail) {
      return this.getTranslate('detail');
    } else if (this.isUpdate) {
      return this.getTranslate('update');
    } else {
      return this.getTranslate('create');
    }
  }

  getCurrentMonth(): void {
    // Month trên fontend lệch 1 so với month xử lý dưới backend
    const currentMonth: number = this.currentDate.getMonth() + 1;
    const filterMonthOfYear = this.monthOfYears.find((item) => item.numberValue === currentMonth);
    if (filterMonthOfYear !== undefined) {
      this.currentMonth = filterMonthOfYear?.value;
    }
  }

  getCurrentDay(): void {
    const currentDay: number = this.currentDate.getDate();
    this.currentDay = currentDay;
  }

  getCurrentDayOfWeek(): void {
    const currentWeek: number = this.currentDate.getDay();
    const filterDayOfWeek = this.dayOfWeeks.find((item) => item.numberValue === currentWeek);
    if (filterDayOfWeek !== undefined) {
      this.currentDayOfWeek = filterDayOfWeek?.value;
    }
  }

  changeStartDate(): void {
    this.startDate = moment(
      this.form?.controls?.startDate?.value,
      DEFAULT_DATE_FORMAT
    )?.toDate();
    if (this.startDate?.toString() !== 'Invalid Date') {
      if (
        differenceInCalendarDays(
          this.form.controls.finishDate?.value,
          this.form.controls.startDate?.value
        ) < 0
      ) {
        this.form.controls.finishDate?.setValue(
          this.form.controls.startDate?.value
        );
      }
      if (
        differenceInCalendarDays(
          this.form.controls.endDate?.value,
          this.form.controls.startDate?.value
        ) < 0
      ) {
        this.form.controls.endDate?.setValue(
          this.form.controls.startDate?.value
        );
      }
    }
  }

  onCancel(): void {
    window.history.back();
  }

  onSubmit(): void {
    if (this.isUpdate) {
      this.updateMeeting();
    } else {
      this.createMeeting();
    }
  }

  onApprove(): void {
    const meetingId = this.id;
    this.meetingService.
      approve(meetingId)
      .subscribe((response) => {
      this.toast.success('model.meeting.success.approve');
      this.route.navigate([ROUTER_UTILS.meeting.root, ROUTER_UTILS.meeting.list]).then();
    });
  }

  onReject(): void {
    const meetingId = this.id;
    this.meetingService.
      reject(meetingId)
      .subscribe((response) => {
      this.toast.success('model.meeting.success.reject');
      this.route.navigate([ROUTER_UTILS.meeting.root, ROUTER_UTILS.meeting.list]).then();
    });
  }

  private updateMeeting(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    this.handleMapUpdateRequest(this.form, this.meetingUpdateRequest);
    this.meetingService
      .update(this.meetingUpdateRequest, this.id)
      .subscribe((response) => {
        this.toast.success('model.meeting.success.update');
        this.route.navigate([`meeting/list`]).then();
      });
  }

  private createMeeting(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    this.handleMapUpdateRequest(this.form, this.meetingUpdateRequest);
    this.meetingService
      .create(this.meetingUpdateRequest)
      .subscribe((response) => {
        this.toast.success('model.meeting.success.create');
        this.route.navigate([`meeting/list`]).then();
      });
  }

  handleMapUpdateRequest(form: FormGroup, request: MeetingUpdateRequest): void {
    request.title = form?.get('title')?.value;
    request.meetingType = form?.get('meetingType')?.value;
    request.description = form?.get('description')?.value;
    request.requiredUserIds = form?.get('requiredUserIds')?.value;
    request.optionalUserIds = form?.get('optionalUserIds')?.value;
    request.presiderId = form?.get('presiderId')?.value;
    request.startAt = this.resolveDateAndTime(new Date(form?.get('startDate')?.value), form?.get('startTime')?.value).getTime();
    request.finishAt = this.resolveDateAndTime(new Date(form?.get('finishDate')?.value), form?.get('finishTime')?.value).getTime();
    request.endDate = moment(new Date(form?.get('endDate')?.value)).format(END_DATE_FORMAT);
    request.repeatType = form?.get('repeatType')?.value;
    if (this.repeatType !== REPEAT_TYPES.NOT_REPEAT) {
      request.repeatMeasure = form?.get('repeatMeasure')?.value;
      if (this.repeatType === REPEAT_TYPES.WEEKLY_REPEAT) {
        request.dayOfWeekList = this.getDayOfWeekList(this.repeatType, request);
      } else if (this.repeatType === REPEAT_TYPES.MONTHLY_REPEAT) {
        if (this.radioValue === SELECT_OPTIONS.FIRST_OPTION) {
          request.dayOfMonth = form?.get('dayOfMonth')?.value;
        } else if (this.radioValue === SELECT_OPTIONS.SECOND_OPTION) {
          this.dayOfWeek = form?.get('dayOfWeek')?.value;
          request.dayOfWeekList = this.getDayOfWeekList(
            this.repeatType,
            request
          );
          request.weekOfMonth = form?.get('weekOfMonth')?.value;
        }
      } else if (this.repeatType === REPEAT_TYPES.YEARLY_REPEAT) {
        if (this.radioValue === SELECT_OPTIONS.FIRST_OPTION) {
          request.dayOfMonth = form?.get('dayOfMonth')?.value;
        } else if (this.radioValue === SELECT_OPTIONS.SECOND_OPTION) {
          this.dayOfWeek = form?.get('dayOfWeek')?.value;
          request.dayOfWeekList = this.getDayOfWeekList(
            this.repeatType,
            request
          );
          request.weekOfMonth = form?.get('weekOfMonth')?.value;
        }
        request.monthOfYear = form?.get('monthOfYear')?.value;
      }
    }

    if (this.meetingType === OFFLINE) {
      request.roomId = form?.get('roomId')?.value;
    } else if (this.meetingType === ONLINE) {
      request.link = form?.get('link')?.value;
    }
  }

  selectAll(controls: string, value: any[]): void {
    const formControl = this.form.controls[controls];
    if (formControl.value?.length === value.length) {
      formControl.setValue([]);
    } else {
      formControl.setValue(this.mappingUsers(value));
    }
  }

  resolveDateAndTime(date: Date, time: string): Date {
    const newDateTime = moment().toDate();
    // resolve date
    newDateTime.setDate(date.getDate());
    newDateTime.setMonth(date.getMonth());
    newDateTime.setFullYear(date.getFullYear());
    // resolve time
    const [hours, minutes] = time.split(':');
    newDateTime.setHours(Number(hours));
    newDateTime.setMinutes(Number(minutes));
    newDateTime.setSeconds(0);
    newDateTime.setMilliseconds(0);
    return newDateTime;
  }

  onChangeData(type: string, content: string): void {
    this.form.get(type)?.setValue(content);
  }

  getLimitLength(str: string, length: number = 20): string {
    return CommonUtil.getLimitLength(str, length);
  }

  mappingUsers(users: IUser[]): any {
    return users.map((user: IUser) => user.id);
  }

  changeRepeatType(repeatType: any) {
    this.repeatType = repeatType;
  }

  changeMeetingType(meetingType: any) {
    if (meetingType === MEETING_TYPES.ONLINE) {
      this.form.get('link')?.addValidators(Validators.required);
      this.form.get('roomId')?.removeValidators(Validators.required);
      this.form.get('link')?.updateValueAndValidity();
      this.form.get('roomId')?.updateValueAndValidity();
    } else if (meetingType === MEETING_TYPES.OFFLINE) {
      this.form.get('roomId')?.addValidators(Validators.required);
      this.form.get('link')?.removeValidators(Validators.required);
      this.form.get('link')?.updateValueAndValidity();
      this.form.get('roomId')?.updateValueAndValidity();
    }
    this.meetingType = meetingType;
  }

  getDayOfWeekList(repeatType: any, request: MeetingUpdateRequest): string[] {
    let dayOfWeekList: string[] = []
    if (repeatType === REPEAT_TYPES.WEEKLY_REPEAT) {
      dayOfWeekList = this.weekOptions
        .filter((opt) => opt.checked)
        .map((opt) => opt.value);
    } else if (repeatType === REPEAT_TYPES.MONTHLY_REPEAT || REPEAT_TYPES.YEARLY_REPEAT) {
      dayOfWeekList.push(this.dayOfWeek);
    }
    return dayOfWeekList;
  }

  handerAttendeeToForm(meetingAttendees: IMeetingAttendee[]): void {
    const requiredUserIds: string[] = [];
    const optionalUserIds: string[] = [];
    for (const meetingAttendee of meetingAttendees) {
      if (meetingAttendee?.attendeeType === ATTENDEE_TYPE.REQUIRED) {
        if (meetingAttendee.userId !== undefined) {
          requiredUserIds.push(meetingAttendee.userId);
        }
      }
      if (meetingAttendee?.attendeeType === ATTENDEE_TYPE.OPTIONAL) {
        if (meetingAttendee.userId !== undefined) {
          optionalUserIds.push(meetingAttendee.userId);
        }
      }
    }
    if (requiredUserIds.length !== 0) {
      // get data require user đổ vào select box
      this.userService.findByUserIds(requiredUserIds).subscribe(
        (response: any) => {
          this.requiredUsers = response?.body.data;
        }
      );
      this.form.get('requiredUserIds')?.setValue(requiredUserIds || []);
    }
    if (optionalUserIds.length !== 0) {
      // get data optional user đổ vào select box
      this.userService.findByUserIds(optionalUserIds).subscribe(
        (response: any) => {
          this.optionalUsers = response?.body.data;
          console.log('hello', this.optionalUsers);
        }
      );
      this.form.get('optionalUserIds')?.setValue(optionalUserIds || []);
    }
  }

  changeStartTime(startTime: string) {
    const [hourString, minuteString] = startTime.split(':');
    let minute = +minuteString + this.durationTime;
    let hour = +hourString;
    if (minute < this.maxMinute) {
      this.finishTime = moment({ hour, minute }).format(DEFAULT_TIME_FORMAT)
    } else {
      hour += 1;
      minute = 0;
      this.finishTime = moment({ hour, minute }).format(DEFAULT_TIME_FORMAT)
    }
    this.form.get('finishTime')?.setValue(this.finishTime || null);
    this.finishTimeBlocks = this.getBlockFinishTimesFromStartTime(
      startTime,
      this.durationTime
    );
  }

  getBlockStartTimes(durationTime: number): string[] {
    const times: string[] = [];
    for (let hour = this.minMeetingHour; hour < this.maxMeetingHour; hour++) {
      for (
        let minute = 0;
        minute <= this.maxMinute - durationTime;
        minute += durationTime
      ) {
        times.push(moment({ hour, minute }).format(DEFAULT_TIME_FORMAT));
      }
    }
    return times;
  }

  getBlockFinishTimesFromStartTime(
    startTime: string,
    durationTime: number
  ): string[] {
    const times: string[] = [];
    const [hourString, minuteString] = startTime.split(':');
    let index = 1;
    let minute = +minuteString + durationTime;
    for (let hour = +hourString; hour <= this.maxMeetingHour; hour++) {
      if (hour === this.maxMeetingHour) {
        minute = 0;
        times.push(moment({ hour, minute }).format(DEFAULT_TIME_FORMAT));
      } else {
        if (index > 1) {
          minute = 0;
        }
        while (minute <= this.maxMinute - durationTime) {
          times.push(moment({ hour, minute }).format(DEFAULT_TIME_FORMAT));
          minute += durationTime;
        }
        index += 1;
      }
    }
    return times;
  }

  getRoundCurrentTime(durationTime: number): string {
    let date = moment().toDate();
    // Check currentTime not in allowed block time
    if (date.getHours() < this.minMeetingHour || date.getHours() > this.maxMeetingHour) {
      const hour = this.minMeetingHour;
      const minute = 0;
      return moment({ hour, minute}).format(DEFAULT_TIME_FORMAT);
    }
    // Round currentTime base on durationTime
    const ms = 1000 * 60 * durationTime;
    date = new Date(Math.ceil(date.getTime() / ms) * ms);
    return moment(date).format(DEFAULT_TIME_FORMAT);
  }

  handlerDayOfWeekListToForm(dayOfWeekList: string[]): void {
    if (dayOfWeekList.length === 1) {
      this.form.get('dayOfWeek')?.setValue(dayOfWeekList[0]);
    } else if (dayOfWeekList.length > 1) {
      for (const week of this.weekOptions) {
        if (week.checked === true) {
          week.checked = false;
        }
        if (week.disabled === true) {
          week.disabled = false;
        }
      }
      const selectedWeek = this.weekOptions.filter((item) =>
        dayOfWeekList.includes(item.value)
      );
      for (const week of selectedWeek) {
        week.checked = true;
      }
    }
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
}
