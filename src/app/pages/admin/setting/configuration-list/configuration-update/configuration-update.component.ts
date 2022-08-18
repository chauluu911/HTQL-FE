import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CONFIGURATION_TYPES } from '@shared/constants/configuration.constants';
import {
  LENGTH_VALIDATOR,
  VALIDATORS,
} from '@shared/constants/validators.constant';
import { IValidateMessage } from '@shared/interface/validate-message';
import { IConfiguration } from '@shared/models/configuration.model';
import { ConfigurationService } from '@shared/services/configuration.service';
import CommonUtil from '@shared/utils/common-utils';
import Validation from '@shared/validators/confirmed-password.validator';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-configuration-update',
  templateUrl: './configuration-update.component.html',
  styleUrls: ['./configuration-update.component.scss'],
})
export class ConfigurationUpdateComponent implements OnInit, AfterViewInit {
  public configuration: IConfiguration = {};
  public isUpdate = false;
  public translatePath = 'model.configuration.';
  public form: FormGroup = new FormGroup({});
  public configurationTypes: { label: string; value: string }[] =
    CONFIGURATION_TYPES;
  public LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  public title = '';
  public validateMessages: IValidateMessage[] = [
    {
      field: 'code',
      fieldName: this.translatePath + 'code',
      valid: [{ type: 'required' }, { type: 'pattern', param: 'a-zA-Z0-9' }],
    },
    {
      field: 'type',
      fieldName: this.translatePath + 'type',
      valid: [{ type: 'required' }],
    },
    {
      field: 'name',
      fieldName: this.translatePath + 'name',
      valid: [
        { type: 'required' },
        { type: 'maxlength', param: LENGTH_VALIDATOR.LABEL_MAX_LENGTH.MAX },
        { type: 'minlength', param: 2 },
      ],
    },
    {
      field: 'value',
      fieldName: this.translatePath + 'value',
      valid: [
        { type: 'required' },
        { type: 'maxlength', param: LENGTH_VALIDATOR.DESC_MAX_LENGTH.MAX },
        { type: 'minlength', param: 2 },
        { type: 'pattern', message: '(số điện thoại không hợp lệ)' },
      ],
    },
  ];

  constructor(
    private modalRef: NzModalRef,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private configurationService: ConfigurationService
  ) {}

  ngOnInit(): void {
    this.configuration = this.modalRef?.getConfig()?.nzComponentParams || {};
    this.isUpdate = !!this.configuration?.id;
    this.initForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.title = !!this.configuration?.id
        ? this.translate.instant(this.translatePath + 'detail.updateTitle')
        : this.translate.instant(this.translatePath + 'detail.createTitle');
    }, 10);
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      type: [
        {
          value: this.configuration?.type || '',
          disabled: this.isUpdate,
        },
        [Validators.required],
      ],
      code: [
        {
          value: this.configuration?.code || '',
          disabled: this.isUpdate,
        },
        [
          Validation.notBlank,
          Validators.maxLength(LENGTH_VALIDATOR.CODE_MAX_LENGTH.MAX),
          Validators.pattern(VALIDATORS.CODE),
        ],
      ],
      name: [
        {
          value: this.configuration.name || '',
          disabled: false,
        },
        [
          Validation.notBlank,
          Validators.minLength(2),
          Validators.maxLength(LENGTH_VALIDATOR.LABEL_MAX_LENGTH.MAX),
        ],
      ],
      value: [
        {
          value: this.configuration.value || '',
          disabled: false,
        },
        [
          Validation.notBlank,
          Validators.minLength(2),
          Validators.maxLength(LENGTH_VALIDATOR.DESC_MAX_LENGTH.MAX),
        ],
      ],
    });
    this.form.get('type')?.valueChanges.subscribe((value) => {
      if (value === 'PHONE_NUMBER') {
        this.form
          .get('value')
          ?.setValidators([
            Validation.notBlank,
            Validators.minLength(2),
            Validators.pattern(VALIDATORS.SIMPLE_PHONE),
            Validators.maxLength(LENGTH_VALIDATOR.DESC_MAX_LENGTH.MAX),
          ]);
        this.form.get('value')?.updateValueAndValidity();
      } else {
        this.form
          .get('value')
          ?.setValidators([
            Validation.notBlank,
            Validators.minLength(2),
            Validators.maxLength(LENGTH_VALIDATOR.DESC_MAX_LENGTH.MAX),
          ]);
        this.form.get('value')?.updateValueAndValidity();
      }
    });
    if (this.isUpdate && this.configuration?.type === 'PHONE_NUMBER') {
      this.form
        .get('value')
        ?.setValidators([
          Validation.notBlank,
          Validators.minLength(2),
          Validators.pattern(VALIDATORS.SIMPLE_PHONE),
          Validators.maxLength(LENGTH_VALIDATOR.DESC_MAX_LENGTH.MAX),
        ]);
      this.form.get('value')?.updateValueAndValidity();
    }
  }

  getLimitLength(str: string, length: number = 20): string {
    return CommonUtil.getLimitLength(str, length);
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: this.form.value,
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const configuration: IConfiguration = {
      ...this.configuration,
      ...this.form.value,
    };
    if (this.isUpdate) {
      this.updateConfiguration(configuration);
    } else {
      this.createConfiguration(configuration);
    }
  }

  createConfiguration(newConfig: IConfiguration): void {
    this.configurationService.create(newConfig).subscribe((res) => {
      this.modalRef.close({
        success: true,
        value: { ...this.configuration, ...this.form.value },
      });
    });
  }

  updateConfiguration(updateConfig: IConfiguration): void {
    this.configurationService
      .update(this.configuration?.id || '', updateConfig)
      .subscribe((res) => {
        this.modalRef.close({
          success: true,
          value: { ...this.configuration, ...this.form.value },
        });
      });
  }
}
