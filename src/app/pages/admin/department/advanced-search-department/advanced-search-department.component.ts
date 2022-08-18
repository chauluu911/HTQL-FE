import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IDepartmentRequest } from '@shared/models/request/department-request.model';
import CommonUtil from '@shared/utils/common-utils';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-advanced-search-department',
  templateUrl: './advanced-search-department.component.html',
  styleUrls: ['./advanced-search-department.component.scss'],
})
export class AdvancedSearchDepartmentComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  createdAt = new Date();

  @ViewChild('startPicker') startPicker!: NzDatePickerComponent;

  @ViewChild('endPicker') endPicker!: NzDatePickerComponent;

  departmentRequest: IDepartmentRequest = {};

  constructor(private fb: FormBuilder, private modalRef: NzModalRef) {
    this.departmentRequest =
      this.modalRef?.getConfig()?.nzComponentParams?.departmentRequest || {};
    this.initForm();
  }

  ngOnInit(): void {}

  initForm(): void {
    this.form = this.fb.group({
      createdAt: [this.departmentRequest.startAt || null],
      lastModifiedAt: [this.departmentRequest.endAt || null],
    });
  }

  onSubmit(): void {
    const body = this.form.value;
    this.modalRef.close({
      data: body,
      success: !this.form.invalid,
    });
  }

  disabledBeforeToday(current: Date): boolean {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) < 0;
  }

  disabledBeforeStartAt(current: Date): boolean {
    const date = document.getElementById('startPicker') as HTMLInputElement;

    return (
      differenceInCalendarDays(
        current,
        moment(date?.value, 'DD/MM/yyyy').toDate()
      ) < 0
    );
  }

  enterDatePicker(event: any, nameDate: string): void {
    const date = event?.target?.value;
    if (nameDate === 'createdAt') {
      if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
        this.form.controls[nameDate].setValue(
          this.form.controls[nameDate].value
        );
        this.startPicker.close();
      } else if (!this.disabledBeforeToday(CommonUtil.newDate(date))) {
        this.form.controls[nameDate].setValue(CommonUtil.newDate(date));
        this.startPicker.close();
      } else {
        this.form.controls[nameDate].setValue(
          this.form.controls[nameDate].value
        );
        this.startPicker.close();
      }
    } else if (nameDate === 'lastModifiedAt') {
      if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
        this.form.controls[nameDate].setValue(
          this.form.controls[nameDate].value
        );
        this.endPicker.close();
      } else if (!this.disabledBeforeStartAt(CommonUtil.newDate(date))) {
        this.form.controls[nameDate].setValue(CommonUtil.newDate(date));
        this.endPicker.close();
      } else {
        this.form.controls[nameDate].setValue(
          this.form.controls[nameDate].value
        );
        this.endPicker.close();
      }
    }
  }

  changeStartAt(): void {
    this.createdAt = moment(
      this.form?.controls?.createdAt.value,
      'DD/MM/yyyy'
    ).toDate();
    if (
      differenceInCalendarDays(
        this.form.controls.lastModifiedAt.value,
        this.form.controls.createdAt.value
      ) < 0
    ) {
      this.form.controls.lastModifiedAt.setValue(
        this.form.controls.createdAt.value
      );
    }
  }

  selectAll(controls: string, value: any[]): void {
    const formControl = this.form.controls[controls];
    if (formControl.value?.length === value.length) {
      formControl.setValue([]);
    }
  }

  onCancel(): void {
    this.form.get('createdAt')?.reset();
    this.form.get('lastModifiedAt')?.reset();
  }
}
