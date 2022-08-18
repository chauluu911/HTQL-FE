import { HttpResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit, ViewEncapsulation
} from '@angular/core';
import { MAX_MEETING_HOUR, MIN_MEETING_HOUR } from '@shared/constants/meeting.constants';
import { IBaseResponse } from '@shared/models/base.model';
import { IUserSchedulerRequest } from '@shared/models/request/user-scheduler-request.model';
import { IUserSchedulerResponse } from '@shared/models/user-scheduler-response.model';
import { SchedulerService } from '@shared/services/scheduler.service';
import CommonUtil from '@shared/utils/common-utils';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserSchedulerComponent } from './user-scheduler/user-scheduler.component';
export type EntityResponseType<T> = HttpResponse<IBaseResponse<T>>;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Week;
  viewDate = moment().toDate();
  events$!: Observable<CalendarEvent<{userSchedulersReponses: IUserSchedulerResponse}>[]>;
  userSchedulerResponseList: CalendarEvent<{userSchedulersReponses: IUserSchedulerResponse}>[] = [];
  userSchedulerRequest: IUserSchedulerRequest = {};
  userSchedulerResponse: IUserSchedulerResponse = {};
  minMeetingHour = MIN_MEETING_HOUR;
  maxMeetingHour = MAX_MEETING_HOUR;

  constructor(
    private modalService: NzModalService,
    private schedulerService: SchedulerService,
  ) {
   }

  ngOnInit(): void {
    this.fetchEvents();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.userSchedulerResponse = event.meta.userSchedulerResponse;
    const base = CommonUtil.modalBase(
      UserSchedulerComponent,
      {
        userSchedulerResponse : this.userSchedulerResponse
      },
      '30%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.fetchEvents();
      }
    });
  }

  fetchEvents(): void {
    if (this.view === CalendarView.Month) {
      this.userSchedulerRequest.startAt = CommonUtil.getStartOfMonth(this.viewDate.getTime());
      this.userSchedulerRequest.finishAt = CommonUtil.getEndOfMonth(this.viewDate.getTime());
    }

    if (this.view === CalendarView.Week) {
      this.userSchedulerRequest.startAt = CommonUtil.getStartOfWeek(this.viewDate.getTime());
      this.userSchedulerRequest.finishAt = CommonUtil.getEndOfWeek(this.viewDate.getTime());
    }

    if (this.view === CalendarView.Day) {
      this.userSchedulerRequest.startAt = CommonUtil.getStartOfDay(this.viewDate.getTime());
      this.userSchedulerRequest.finishAt = CommonUtil.getEndOfDay(this.viewDate.getTime());
    }

    this.events$ = this.schedulerService.getScheduler(this.userSchedulerRequest, true)
    .pipe(
      map((results: EntityResponseType<IUserSchedulerResponse[]>) => {
        return (results?.body?.data as IUserSchedulerResponse[]).map((userSchedulerResponse: IUserSchedulerResponse) => {
          this.userSchedulerResponseList.push(userSchedulerResponse as CalendarEvent);
          return {
            id: userSchedulerResponse?.id,
            start: new Date(userSchedulerResponse?.startAt as number),
            end: new Date(userSchedulerResponse?.finishAt as number),
            title: userSchedulerResponse?.title,
            meta: {
              userSchedulerResponse
            },
          } as CalendarEvent;
        });
      })
    );
  }
}
