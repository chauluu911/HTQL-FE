import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PRODUCT_TYPE, PRODUCT_TYPE_STR } from '@shared/constants/common.constant';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { IProductSearchRequest, ProductSearchRequest } from '@shared/models/request/product-search-request.model';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.scss']
})
export class SearchProductComponent implements OnInit {

  productSearchRequest: IProductSearchRequest = new ProductSearchRequest();
  formSearchProduct: FormGroup = new FormGroup({});
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;

  types = PRODUCT_TYPE;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
  ) {
    this.productSearchRequest =
      this.modalRef?.getConfig()?.nzComponentParams?.productSearchRequest || {};
    this.initForm();
    this.disableFields();
    this.onFormChanges();
  }

  ngOnInit(): void {
  }

  initForm(): void {
    this.formSearchProduct = this.fb.group({
      name: [this.productSearchRequest.name || null],
      type: [this.productSearchRequest.type || null],
      startPrice: [this.productSearchRequest.startPrice || null],
      endPrice: [this.productSearchRequest.endPrice || null],
    });
  }

  disableFields(): void {
    this.formSearchProduct.get('startPrice')?.disable();
    this.formSearchProduct.get('endPrice')?.disable();
  }

  onFormChanges(): void {
    this.formSearchProduct.controls.type.valueChanges.subscribe((value) => {
      if (value !== PRODUCT_TYPE_STR.LUNCH) {
        this.formSearchProduct.get('startPrice')?.enable();
        this.formSearchProduct.get('endPrice')?.enable();
      } else {
        this.formSearchProduct.get('startPrice')?.disable();
        this.formSearchProduct.get('endPrice')?.disable();
      }
    })
  }

  onSubmit(): void {
    this.modalRef.close({
      data: {
        ...this.formSearchProduct.value,
        startPrice: this.formSearchProduct.value.startPrice && CommonUtil.formatToNumber(this.formSearchProduct.value.startPrice),
        endPrice: this.formSearchProduct.value.endPrice && CommonUtil.formatToNumber(this.formSearchProduct.value.endPrice)
      },
      success: !this.formSearchProduct.invalid,
    })
  }

  onCancel(): void {
    this.formSearchProduct.reset();
  }

}
