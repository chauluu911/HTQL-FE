import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { RoomSchedulerResponse } from '@shared/models/room-scheduler-response.model';
import { IUser } from '@shared/models/user.model';
import { UserService } from '@shared/services/user.service';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-room-scheduler',
  templateUrl: './room-scheduler.component.html',
  styleUrls: ['./room-scheduler.component.scss']
})
export class RoomSchedulerComponent implements OnInit {

  @Input() roomSchedulerResponse: RoomSchedulerResponse = new RoomSchedulerResponse();
  pathTranslate = 'model.meeting.roomScheduler.';
  form: FormGroup = new FormGroup({});
  organizer: IUser = {};

  constructor(
    private modalRef: NzModalRef,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit(): void {}

  // loadDataOrganizerToForm(): void {
  //   const organizerId = this.roomSchedulerResponse.organizerId;
  //   if (organizerId !== undefined) {
  //     this.userService.find(organizerId).subscribe(
  //       (response: any) => {
  //         this.organizer = response?.body.data;
  //         this.form.get('organizerName')?.setValue(this.organizer.fullName || '');
  //       }
  //     );
  //   }
  // }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: null,
    });
  }

  getTranslate(str: string): string {
    return this.translateService.instant(this.pathTranslate + '' + str);
  }
}
