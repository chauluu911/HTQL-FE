import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ASSET_STATUS,
  ASSET_TYPE_STATUS,
} from '@shared/constants/asset.constant';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { Asset, IAsset } from '@shared/models/asset.model';
import { AssetService } from '@shared/services/asset.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-update-asset-type',
  templateUrl: './update-asset-type.component.html',
})
export class UpdateAssetTypeComponent implements OnInit {
  isUpdate = false;
  asset: Asset = new Asset();
  form: FormGroup = new FormGroup({});
  formType: FormGroup = new FormGroup({});
  listAssets: IAsset[] = [];
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  parent: IAsset = {};
  assetStatus = ASSET_STATUS;
  assetTypeStatus = ASSET_TYPE_STATUS;
  constructor(
    private fb: FormBuilder,
    private assetService: AssetService,
    private modalRef: NzModalRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }
  initForm(): void {
    this.formType = this.fb.group({
      code: [
        {
          value: this.isUpdate ? this.asset?.code : null,
          disabled: this.isUpdate,
        },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.CODE_MAX_LENGTH.MAX),
        ],
      ],
      name: [
        this.isUpdate ? this.asset?.name : null,
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX),
        ],
      ],
      status: [
        this.isUpdate ? this.asset?.status : null,

        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.STATUS_MAX_LENGTH.MAX),
        ],
      ],
      description: [this.isUpdate ? this.asset?.description : null],
    });
  }
  onSubmitType(): void {
    if (this.isUpdate) {
      this.updateAssetType();
    } else {
      this.createAssetType();
    }
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: null,
    });
  }
  private updateAssetType(): void {
    if (this.formType.invalid) {
      CommonUtil.markFormGroupTouched(this.formType);
      return;
    }
    const asset: Asset = {
      ...this.formType.value,
    };
    const body = CommonUtil.trim(asset);
    if (this.asset?.id) {
      this.assetService
        .updateAssetType(asset, this.asset.id)
        .subscribe((res) => {
          this.toast.success('model.asset.type.updateSuccess');
          this.modalRef.close();
        });
    }
  }
  private createAssetType(): void {
    if (this.formType.invalid) {
      CommonUtil.markFormGroupTouched(this.formType);
      return;
    }
    const asset: Asset = {
      ...this.formType.value,
    };
    this.assetService.createAssetType(asset).subscribe((res) => {
      this.toast.success('model.asset.type.createSuccess');
      this.modalRef.close();
    });
  }
}
