import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { APPROVE_STATUSS, MEETING_TYPES } from '@shared/constants/meeting.constants';
import { IRoom } from '@shared/models/room.model';
import { UserSchedulerResponse } from '@shared/models/user-scheduler-response.model';
import { IUser } from '@shared/models/user.model';
import { ToastService } from '@shared/services/helpers/toast.service';
import { RoomService } from '@shared/services/room.service';
import { SchedulerService } from '@shared/services/scheduler.service';
import { UserService } from '@shared/services/user.service';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-user-scheduler',
  templateUrl: './user-scheduler.component.html',
  styleUrls: ['./user-scheduler.component.scss']
})
export class UserSchedulerComponent implements OnInit {

  @Input() userSchedulerResponse: UserSchedulerResponse = new UserSchedulerResponse();
  pathTranslate = 'model.meeting.scheduler.';
  form: FormGroup = new FormGroup({});
  rooms: IRoom[] = [];
  meetingType = '';
  MEETING_TYPES = MEETING_TYPES;
  APPROVE_STATUSS = APPROVE_STATUSS;
  user: IUser = {};

  constructor(
    private modalRef: NzModalRef,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private roomService: RoomService,
    private schedulerService: SchedulerService,
    private toast: ToastService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.findUserByUserId();
    this.initData();
    // this.loadDataOrganizerToForm();
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: null,
    });
  }

  getTranslate(str: string): string {
    return this.translateService.instant(this.pathTranslate + '' + str);
  }

  initData(): void {
    // this.loadDataRoom();
    // this.loadDataAttendees();
    this.meetingType = this.userSchedulerResponse?.meetingType || '';
  }

  onReject(): void {
    this.schedulerService.
      rejectUserScheduler(this.userSchedulerResponse.id as string)
      .subscribe((response) => {
      this.toast.success('model.meeting.success.reject');
      this.modalRef.close({
        success: true,
      });
    });
  }

  // loadDataOrganizerToForm(): void {
  //   const organizerId = this.userSchedulerResponse.organizerId;
  //   if (organizerId !== undefined) {
  //     this.userService.find(organizerId).subscribe(
  //       (response: any) => {
  //         this.organizer = response?.body.data;
  //         this.form.get('organizerName')?.setValue(this.organizer.fullName || '');
  //       }
  //     );
  //   }
  // }

  // loadDataAttendees(): void {
  //   const requiredUserIds = this.userSchedulerResponse.requiredUserIds;
  //   const optinalUserIds = this.userSchedulerResponse.optionalUserIds;
  //   if (requiredUserIds !== undefined && requiredUserIds.length !== 0) {
  //     // get data require user đổ vào select box
  //     this.userService.findByUserIds(requiredUserIds).subscribe(
  //       (response: any) => {
  //         this.requiredUsers = response?.body.data;
  //       }
  //     );
  //   }
  //   if (optinalUserIds !== undefined && optinalUserIds.length !== 0) {
  //     // get data optional user đổ vào select box
  //     this.userService.findByUserIds(optinalUserIds).subscribe(
  //       (response: any) => {
  //         this.requiredUsers = response?.body.data;
  //       }
  //     );
  //   }
  // }

  // loadDataRoom(isLoading = false): void {
  //   const options = {
  //     status: ROOM_STATUSS.ACTIVE
  //   };
  //   this.roomService
  //     .searchAutoComplete(options, isLoading)
  //     .subscribe((res: any) => {
  //       this.rooms = res.body?.data;
  //     });
  // }

  findUserByUserId() {
    this.userService.find(this.userSchedulerResponse.userId, true).subscribe((response: any) => {
      const data = response?.body?.data;
      this.user = data;
    })
  }
}
