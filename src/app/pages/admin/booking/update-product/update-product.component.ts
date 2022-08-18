import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PRODUCT_SUBTYPE, PRODUCT_TYPE, PRODUCT_TYPE_STR } from '@shared/constants/common.constant';
import {
  LENGTH_VALIDATOR
} from '@shared/constants/validators.constant';
import { IProduct, Product } from '@shared/models/product.model';
import { ProductService } from '@shared/services/booking/product.service';
import { FileService } from '@shared/services/file.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { ROUTER_ACTIONS } from '@shared/utils/router.utils';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FOOD_PLACEHOLDER_FILE } from '../common-booking/booking.constant';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent implements OnInit {

  @Input() action = '';
  @Input() product: IProduct = new Product();
  form: FormGroup = new FormGroup({});
  types = PRODUCT_TYPE;

  subTypes = PRODUCT_SUBTYPE;

  initalState: IProduct = new Product('', '',  undefined);

  LENGTH_VALIDATOR = LENGTH_VALIDATOR;

  ROUTER_ACTIONS = ROUTER_ACTIONS;

  foodPlaceholder = FOOD_PLACEHOLDER_FILE;
  file?: File;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private productService: ProductService,
    private fileService: FileService,
    private modalRef: NzModalRef,
    private toast: ToastService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.onFormChanges();
  }

  initForm(): void {
    const dataObject = this.action === this.ROUTER_ACTIONS.create ? this.initalState : this.product;
    this.form = this.fb.group({
      name: [
        dataObject.name,
        [Validators.required]
      ],
      price: [
        dataObject?.price,
        [Validators.required]
      ],
      type: [
        dataObject.type,
        [Validators.required]
      ],
      subType: [
        dataObject?.subType,
        [Validators.required]
      ],
    })
  };

  onSubmit(): void {
    if (this.file) {
      this.fileService.uploadFile(this.file).subscribe((response: any) => {

        const file = response.body?.data;
        const product: IProduct = {
          ...this.form.value,
          imageId: file.id,
          price: this.form.value.price && CommonUtil.formatToNumber(this.form.value.price)
        };

        if (this.action === this.ROUTER_ACTIONS.update) {
          this.updateProduct(product);
        } else {
          this.createProduct(product);
        }
      });
    } else {
      const product: IProduct = {
        ...this.form.value,
        price: this.form.value.price && CommonUtil.formatToNumber(this.form.value.price)
      };

      if (this.action === this.ROUTER_ACTIONS.update) {
        this.updateProduct(product);
      } else {
        this.createProduct(product);
      }
    }

  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: null,
    })
  }


  /**
   * disable các field theo nghiệp vụ sản phẩm
   */
  onFormChanges(): void {

    // disable all fields if current action is detail
    if (this.action === this.ROUTER_ACTIONS.detail) {
      this.form.disable();
    }

    // when create, disable price field on init, enable this later
    if (this.action !== this.ROUTER_ACTIONS.update) {
      this.form.get('price')?.disable();
    }
    // create lunch: no price when add or update
    if (this.form.get('type')?.value === PRODUCT_TYPE_STR.LUNCH) {
      this.form.get('price')?.disable();
      // create food: no subtype when add or update
    } else {
      this.form.get('subType')?.disable();
    }

    // if update, type is not allowd to edit
    // if (this.action === this.ROUTER_ACTIONS.update) {
    //   this.form.get('type')?.disable();
    // }

    this.form?.controls.type?.valueChanges.subscribe((value) => {
      if (value !== PRODUCT_TYPE_STR.LUNCH) {
        this.form.get('subType')?.setValue('');
        this.form.get('subType')?.disable();
        this.form.get('price')?.enable();
      } else {
        this.form.get('subType')?.enable();
        this.form.get('price')?.setValue(undefined);
        this.form.get('price')?.disable();
      }
    });
  }

  private createProduct(product: IProduct): void {
    this.productService.create(product).subscribe((res: any) => {
      this.toast.success('model.product.success.create');
      this.closeModal(res.body.data)
    });
  }

  private updateProduct(product: IProduct): void {
    this.productService.update(this.product.id || '', product).subscribe((res: any) => {
      this.toast.success('model.product.success.update');
      this.closeModal(res.body.data)
    });

  }

  private closeModal(product: IProduct): void {
    this.modalRef.close({
      success: true,
      value: product,
    });
  }

  getFiles(files: any): void {
    if (files) {
      this.file = files[0];
      this.getBase64(files[0]).then((data) => {
        this.product.imageId = data as string;
      });
    }
  }

  getBase64(image: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

}
