import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ASSET_STATUS,
  ASSET_TYPE_STATUS,
} from '@shared/constants/asset.constant';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { Asset, IAsset } from '@shared/models/asset.model';
import { IProduct } from '@shared/models/product.model';
import { IUser } from '@shared/models/user.model';
import { AssetService } from '@shared/services/asset.service';
import { ProductService } from '@shared/services/booking/product.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-update-asset',
  templateUrl: './update-asset.component.html',
})
export class UpdateAssetComponent implements OnInit {
  isUpdate = false;
  asset: Asset = new Asset();
  form: FormGroup = new FormGroup({});
  formType: FormGroup = new FormGroup({});
  listAssetTypes: IAsset[] = [];
  listProducts: IProduct[] = [];
  listUsers: IUser[] = [];
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  parent: IAsset = {};
  assetStatus = ASSET_STATUS;
  assetTypeStatus = ASSET_TYPE_STATUS;
  constructor(
    private fb: FormBuilder,
    private assetService: AssetService,
    private modalRef: NzModalRef,
    private toast: ToastService,
    private productService: ProductService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.searchAssetType();
    this.searchProduct();
    this.searchUser();
  }
  initForm(): void {
    this.form = this.fb.group({
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
      serialNumber: [
        this.isUpdate ? this.asset?.serialNumber : null,
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.ID_MAX_LENGTH.MAX),
        ],
      ],
      description: [this.isUpdate ? this.asset?.description : null],
      assetTypeId: [
        this.isUpdate ? this.asset?.assetTypeId : null,
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.ID_MAX_LENGTH.MAX),
        ],
      ],
      productId: [
        {
          value: this.isUpdate ? this.asset?.productId : null,
          disabled: this.isUpdate,
        },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.ID_MAX_LENGTH.MAX),
        ],
      ],
      ownerId: [
        {
          value: this.isUpdate ? this.asset?.ownerId : null,
          disabled: this.isUpdate,
        },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.ID_MAX_LENGTH.MAX),
        ],
      ],
    });
  }
  onSubmit(): void {
    if (this.isUpdate) {
      this.updateAsset();
    } else {
      this.createAsset();
    }
  }
  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: null,
    });
  }
  searchAssetType() {
    const options = {
      keyword: '',
    };
    this.assetService.assetTypeSearch(options, true).subscribe((res: any) => {
      this.listAssetTypes = res.body?.data as IAsset[];
    });
  }
  searchProduct() {
    const options = {
      keyword: '',
    };
    this.productService.search(options).subscribe((res: any) => {
      this.listProducts = res.body?.data;
    });
  }
  searchUser() {
    const options = {
      keyword: '',
    };
    this.userService.search(options, true).subscribe((res: any) => {
      this.listUsers = res.body?.data as IUser[];
    });
  }
  private updateAsset(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const asset: Asset = {
      ...this.form.value,
    };
    const body = CommonUtil.trim(asset);
    if (this.asset?.id) {
      this.assetService.updateAsset(asset, this.asset.id).subscribe((res) => {
        this.toast.success('model.asset.updateSuccess');
        this.modalRef.close();
      });
    }
  }
  private createAsset(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const asset: Asset = {
      ...this.form.value,
    };
    this.assetService.createAsset(asset).subscribe((res) => {
      this.toast.success('model.asset.createSuccess');
      this.modalRef.close();
    });
  }
}
