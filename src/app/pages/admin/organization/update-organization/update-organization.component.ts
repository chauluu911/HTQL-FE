import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ORGANIZATION_STATUS,
  ORGANIZATION_TYPE_STATUS,
} from '@shared/constants/organization.constant';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { IOrganization, Organization } from '@shared/models/organization.model';
import { ToastService } from '@shared/services/helpers/toast.service';
import { OrganizationService } from '@shared/services/organization.service';
import CommonUtil from '@shared/utils/common-utils';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-organization',
  templateUrl: './update-organization.component.html',
  styleUrls: ['./update-organization.component.scss'],
})
export class UpdateOrganizationComponent implements OnInit {
  isUpdate = false;
  organization: Organization = new Organization();
  form: FormGroup = new FormGroup({});
  listOrganizations: IOrganization[] = [];
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  parent: IOrganization = {};
  organizationStatus = ORGANIZATION_STATUS;
  organizationTypeStatus = ORGANIZATION_TYPE_STATUS;

  @ViewChild('datePicker') datePicker!: NzDatePickerComponent;
  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private modalRef: NzModalRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      businessCode: [
        {
          value: this.isUpdate ? this.organization?.businessCode : null,
          disabled: this.isUpdate,
        },
      ],
      email: [
        this.isUpdate ? this.organization?.email : null,
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.EMAIL_MAX_LENGTH.MAX),
        ],
      ],
      name: [
        this.isUpdate ? this.organization?.name : null,

        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX),
        ],
      ],
      invoiceIssuingAddress: [
        this.isUpdate ? this.organization?.invoiceIssuingAddress : null,
      ],
      status: [
        this.isUpdate ? this.organization?.status : null,
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.STATUS_MAX_LENGTH.MAX),
        ],
      ],
      type: [
        this.isUpdate ? this.organization?.type : null,
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.TYPE_MAX_LENGTH.MAX),
        ],
      ],
      legalRepresentative: [
        this.isUpdate ? this.organization?.legalRepresentative : null,
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.TYPE_MAX_LENGTH.MAX),
        ],
      ],
      phoneNumber: [
        this.isUpdate ? this.organization?.phoneNumber : null,
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.PHONE_MAX_LENGTH.MAX),
        ],
      ],
      incorporationDate: [
        this.isUpdate ? this.organization?.incorporationDate : null,
        [Validators.maxLength(LENGTH_VALIDATOR.BIRTH_MAX_LENGTH.MAX)],
      ],
    });
  }

  onSubmit(): void {
    if (this.isUpdate) {
      this.updateOrganization();
    } else {
      this.createOrganization();
    }
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: null,
    });
  }
  private updateOrganization(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const organization: Organization = {
      ...this.form.value,
    };
    const body = CommonUtil.trim(organization);
    if (this.organization?.id) {
      this.organizationService
        .update(organization, this.organization.id)
        .subscribe((res) => {
          this.toast.success('model.organization.updateSuccess');
          this.modalRef.close();
        });
    }
  }

  private createOrganization(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const organization: Organization = {
      ...this.form.value,
    };
    if (this.form.get('incorporationDate')?.value) {
      organization.incorporationDate = moment(
        organization.incorporationDate
      ).format('yyyy-MM-DD');
    }
    this.organizationService.create(organization).subscribe((res) => {
      this.toast.success('model.organization.createSuccess');
      this.modalRef.close();
    });
  }
  disabledAfterToday(current: Date): boolean {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  }
  enterDatePicker(event: any): void {
    const date = event?.target?.value;
    if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
      this.form.controls.incorporationDate.setValue(
        this.form.controls.incorporationDate.value
      );
      this.datePicker.close();
    } else if (!this.disabledAfterToday(CommonUtil.newDate(date))) {
      this.form.controls.incorporationDate.setValue(CommonUtil.newDate(date));
      this.datePicker.close();
    } else {
      this.form.controls.incorporationDate.setValue(
        this.form.controls.incorporationDate.value
      );
      this.datePicker.close();
    }
  }
}
