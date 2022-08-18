import { Component, Input, OnInit } from '@angular/core';
import { IProduct, Product } from '@shared/models/product.model';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BookingCommonUtil, FOOD_PLACEHOLDER_FILE } from '../common-booking/booking.constant';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit {

  alternateImg = FOOD_PLACEHOLDER_FILE;

  @Input() product: IProduct = new Product();
  constructor(
    private modalRef: NzModalRef,
  ) { }

  ngOnInit(): void {
  }

  pipeType(type: string): string {
    return BookingCommonUtil.pipeProductType(type);
  }

  pipeSubType(type: string): string {
    return BookingCommonUtil.pipeProductSubtype(type);
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      data: null,
    })
  }

}
