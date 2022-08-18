import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  LENGTH_VALIDATOR,
  VALIDATORS
} from '@shared/constants/validators.constant';
import { Room } from '@shared/models/room.model';
import { ToastService } from '@shared/services/helpers/toast.service';
import { RoomService } from '@shared/services/room.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-room-update',
  templateUrl: './room-update.component.html',
  styleUrls: ['./room-update.component.scss'],
})
export class RoomUpdateComponent implements OnInit {
  @Input() isUpdate = false;
  @Input() isDetail = false;
  @Input() room: Room = new Room();
  form: FormGroup = new FormGroup({});
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  pathTranslate = 'model.room.';

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private translateService: TranslateService,
    private roomService: RoomService,
    private toast: ToastService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      code: [
        {
          value: this.isUpdate || this.isDetail ? this.room?.code : '',
          disabled: this.isUpdate || this.isDetail,
        },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.CODE_MAX_LENGTH.MAX),
          Validators.pattern(VALIDATORS.CODE),
        ],
      ],
      name: [
        {
          value: this.isUpdate || this.isDetail ? this.room?.name : '',
          disabled: this.isDetail,
        },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX),
        ],
      ],
      location: [
        {
          value: this.isUpdate || this.isDetail ? this.room?.location : '',
          disabled: this.isDetail,
        },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.ADDRESS_MAX_LENGTH.MAX),
        ],
      ],
      status: [(this.isUpdate || this.isDetail) ? this.room?.status : ''],
    });
  }

  getTranslate(str: string): string {
    return this.translateService.instant(this.pathTranslate + '' + str);
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: null,
    });
  }

  onSubmit(): void {
    if (this.isUpdate) {
      this.updateRoom();
    } else {
      this.createRoom();
    }
  }

  private createRoom(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const room: Room = {
      ...this.form.value,
    };
    this.roomService.create(room).subscribe((res) => {
      this.toast.success('model.room.success.create');
      this.modalRef.close({
        success: true,
        value: room,
      });
    });
  }

  private updateRoom(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const room: Room = {
      ...this.form.value,
    };
    if (this.room?.id) {
      this.roomService.update(room, this.room.id).subscribe((res) => {
        this.toast.success('model.room.success.update');
        this.modalRef.close({
          success: true,
          value: room,
        });
      });
    }
  }
}
