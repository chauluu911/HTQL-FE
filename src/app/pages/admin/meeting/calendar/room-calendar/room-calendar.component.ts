import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MAX_MEETING_HOUR, MIN_MEETING_HOUR } from '@shared/constants/meeting.constants';
import { ROOM_STATUS } from '@shared/constants/room.constants';
import { IBaseResponse } from '@shared/models/base.model';
import { IRoomSchedulerRequest } from '@shared/models/request/room-scheduler-request.model';
import { IRoomSchedulerResponse } from '@shared/models/room-scheduler-response.model';
import { IRoom } from '@shared/models/room.model';
import { RoomService } from '@shared/services/room.service';
import CommonUtil from '@shared/utils/common-utils';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoomSchedulerComponent } from './room-scheduler/room-scheduler.component';
export type EntityResponseType<T> = HttpResponse<IBaseResponse<T>>;

@Component({
  selector: 'app-room-calendar',
  templateUrl: './room-calendar.component.html',
  styleUrls: ['./room-calendar.component.scss']
})
export class RoomCalendarComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  roomId = '';
  view: CalendarView = CalendarView.Week;
  viewDate = moment().toDate();
  events$!: Observable<CalendarEvent<{roomSchedulerResponse: IRoomSchedulerResponse}>[]>;
  roomSchedulerResponse: IRoomSchedulerResponse = {};
  roomSchedulerRequest: IRoomSchedulerRequest = {};
  room: IRoom = {}
  minMeetingHour = MIN_MEETING_HOUR;
  maxMeetingHour = MAX_MEETING_HOUR;
  pathTranslate = 'model.room.';
  roomStatus = ROOM_STATUS;

  constructor(
    private modalService: NzModalService,
    private router: ActivatedRoute,
    private roomService: RoomService,
    private fb: FormBuilder,
    private translateService: TranslateService,
  ) {
    this.router.paramMap.subscribe((response) => {
      this.roomId = response.get('id') || '';
    });
  }

  ngOnInit(): void {
    this.loadDataRoom();
    this.initForm();
    this.fetchEvents();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.roomSchedulerResponse = event.meta.roomSchedulerResponse;
    const base = CommonUtil.modalBase(
      RoomSchedulerComponent,
      {
        roomSchedulerResponse: this.roomSchedulerResponse
      },
      '30%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
      }
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      name: this.room?.name,
      location: this.room?.location,
      code: this.room?.code,
      status: this.room?.status
    });
    this.form.disable();
  }

  getTranslate(str: string): string {
    return this.translateService.instant(this.pathTranslate + '' + str);
  }

  fetchEvents(): void {
    if (this.view === CalendarView.Month) {
      this.roomSchedulerRequest.startAt = CommonUtil.getStartOfMonth(this.viewDate.getTime());
      this.roomSchedulerRequest.finishAt = CommonUtil.getEndOfMonth(this.viewDate.getTime());
    }

    if (this.view === CalendarView.Week) {
      this.roomSchedulerRequest.startAt = CommonUtil.getStartOfWeek(this.viewDate.getTime());
      this.roomSchedulerRequest.finishAt = CommonUtil.getEndOfWeek(this.viewDate.getTime());
    }

    if (this.view === CalendarView.Day) {
      this.roomSchedulerRequest.startAt = CommonUtil.getStartOfDay(this.viewDate.getTime());
      this.roomSchedulerRequest.finishAt = CommonUtil.getEndOfDay(this.viewDate.getTime());
    }

    this.events$ = this.roomService.getRoomScheduler(this.roomId, this.roomSchedulerRequest, true)
    .pipe(
      map((results: EntityResponseType<IRoomSchedulerResponse[]>) => {
        return (results?.body?.data as IRoomSchedulerResponse[]).map((roomSchedulerResponse: IRoomSchedulerResponse) => {
          return {
            id: roomSchedulerResponse?.id,
            start: new Date(roomSchedulerResponse?.startAt as number),
            end: new Date(roomSchedulerResponse?.finishAt as number),
            title: roomSchedulerResponse?.title,
            meta: {
              roomSchedulerResponse
            },
          } as CalendarEvent;
        });
      })
    );
  }

  loadDataRoom() {
    this.roomService.findByRoomId(this.roomId).subscribe(
      (response: any) => {
        const data = response?.body?.data;
        this.room = data;
        this.initForm();
      },
      (error: any) => {
        this.room = {};
      }
    );
  }
}
