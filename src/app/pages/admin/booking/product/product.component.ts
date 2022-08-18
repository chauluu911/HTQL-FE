import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UploadComponent } from '@shared/components/upload/upload.component';
import { PRODUCT_TYPE, SORT } from '@shared/constants/common.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { IProduct, Product } from '@shared/models/product.model';
import { ProductSearchRequest } from '@shared/models/request/product-search-request.model';
import { ProductService } from '@shared/services/booking/product.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { ROUTER_ACTIONS } from '@shared/utils/router.utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMarks } from 'ng-zorro-antd/slider';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BookingCommonUtil } from '../common-booking/booking.constant';
import { DetailProductComponent } from '../detail-product/detail-product.component';
import { SearchProductComponent } from '../search-product/search-product.component';
import { UpdateProductComponent } from '../update-product/update-product.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  productSearchRequest: ProductSearchRequest = {
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
  };
  minPrice = 0;
  maxPrice = 1000000;
  marks: NzMarks = {
    0: '0đ',
    200000: '200.000đ',
    400000: '400.000đ',
    600000: '600.000đ',
    800000: '800.000đ',
    1000000: '1.000.000đ'
  };
  formSearchProduct: FormGroup = new FormGroup({});
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  types = PRODUCT_TYPE;

  isFirstFetch = true;
  products: Product[] = [];
  selectedProduct: Product = new Product();
  total = 0;

  isProductSearchPopupVisible = false;

  groupPopup = {
    title: '',
    content: '',
    okText: '',
    interpolateParams: {},
  };

  searchPopup = {
    title: '',
    okText: ''
  };
  action: any;

  isVisible = false;
  isDeletePopupVisible = false;
  ROUTER_ACTIONS = ROUTER_ACTIONS;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translateService: TranslateService,
    private toast: ToastService,
    private modalService: NzModalService,
    private productService: ProductService,
  ) {
    this.initForm();
   }

  ngOnInit(): void {
    this.loadData();
  }

  initForm(): void {
    this.formSearchProduct = this.fb.group({
      name: [this.productSearchRequest.name || null],
      type: [this.productSearchRequest.type || null],
      rangePrice: [
        [this.minPrice, this.maxPrice],
        []
      ],
      startPrice: [this.productSearchRequest.startPrice || this.minPrice],
      endPrice: [this.productSearchRequest.endPrice || this.maxPrice],
      keyword: [this.productSearchRequest.keyword || null],
    });
  }

  searchWithKeyword(event: Event & { target: Element}): void {
    const keyword = (event.target as HTMLInputElement).value;
    this.productSearchRequest = {
      // ignore current search
      // ...this.productSearchRequest,
      keyword,
    }
    this.loadData();
  }

  import(): void {
    const base = CommonUtil.modalBase(UploadComponent, {
      multiple: true,
      acceptTypeFiles: ['excel'],
    });
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.productSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.loadData();
      }
    });
  }

  loadData(): void {
    this.productService.search(this.productSearchRequest).subscribe(
      (response: any) => {
        const data = response?.body?.data;
        // const page = response?.body?.page;

        this.products = data;
        this.total = response.body.page.total;
      });
  }

  getLimitLength(text: string): string {
    return CommonUtil.getLimitLength(text, 20);
  }

  create(): void {
    const base = CommonUtil.modalBase(
      UpdateProductComponent,
      {
        action: ROUTER_ACTIONS.create,
      },
      '50%'
    );

    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result?.success) {
        this.loadData();
      }
    })
  }

  update(product: IProduct): void {
    // this.router.navigate([`/order/create`])
    const base = CommonUtil.modalBase(
      UpdateProductComponent,
      {
        action: ROUTER_ACTIONS.update,
        product,
      },
      '50%'
    );

    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result?.success) {
        this.loadData();
      }
    })
  }

  detail(product: IProduct): void {
    const base = CommonUtil.modalBase(
      DetailProductComponent,
      {
        action: ROUTER_ACTIONS.detail,
        product,
      },
      '40%'
    );

    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {

    });
  }

  onUpdateProduct(result: { success: boolean }): void {

  }

  delete(product: IProduct): void {
    const deleteForm = CommonUtil.modalConfirm(
      this.translateService,
      'model.product.deleteProductTitle',
      'model.product.deleteProductContent',
      { name: product?.name }
    );

    const modal: NzModalRef = this.modalService.create(deleteForm);
    modal.afterClose.subscribe((result: {success: boolean, data: any}) => {
      if (result?.success) {
        this.productService.delete(product?.id || '').subscribe((response: any) => {
          this.toast.success('model.product.success.delete');
          this.loadData();
        });
      }
    });

  };

  onDeleteProduct(result: { success: boolean }): void {
    if (result?.success) {
      this.productService.delete(this.selectedProduct?.id || '').subscribe(
        (response: any) => {
          if (response.body.success) {
            this.productSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
            this.loadData();
          }
        },
        (error: Error) => {
          this.products = [];
          this.total = 0;
        }
      );
    }
    this.isDeletePopupVisible = false;
  }

  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.productSearchRequest.pageIndex, this.productSearchRequest.pageSize);
  }

  onChangeQueryParam(params: NzTableQueryParams): void {
    if (this.isFirstFetch) {
      this.isFirstFetch = false;
      return;
    }

    const { pageIndex, pageSize, sort, filter } = params;

    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    let sortBy = '';
    if (sortField && sortOrder) {
      sortBy = `${sortField}.${sortOrder === SORT.ASCEND ? SORT.ASC : SORT.DESC}`;
    } else {
      sortBy = '';
    }
    this.productSearchRequest.sortBy = sortBy;
    this.loadData();
  }

  openAdvancedSearch(): void {
    const base = CommonUtil.modalBase(
      SearchProductComponent,
      {
        productSearchRequest: this.productSearchRequest,
      },
      // '50%'
    );

    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result: { success: boolean, data: ProductSearchRequest }) => {
      if (result?.success) {
        const { name, type, startPrice, endPrice } = result.data;
        // update product search request
        this.productSearchRequest = { ...this.productSearchRequest, name, type, startPrice, endPrice };
        this.loadData();
      }
    })
  }

  onQuerySearch(params: { pageIndex: number; pageSize: number }): void {
    const { pageIndex, pageSize } = params;
    this.productSearchRequest.pageIndex = pageIndex;
    this.productSearchRequest.pageSize = pageSize;

    this.loadData();
  }

  pipeType(type: string): string {
    return BookingCommonUtil.pipeProductType(type);
  }

  pipeSubtype(type: string): string {
    return BookingCommonUtil.pipeProductSubtype(type);
  }

  resetSearch(): void{
    this.formSearchProduct.get('name')?.setValue(null);
    this.formSearchProduct.get('type')?.setValue(null);
    this.formSearchProduct.get('keyword')?.setValue(null);
    this.formSearchProduct.get('startPrice')?.setValue(this.minPrice);
    this.formSearchProduct.get('endPrice')?.setValue(this.maxPrice);
    this.formSearchProduct.get('rangePrice')?.setValue([this.minPrice , this.maxPrice]);
    this.search();
  }

  search(): void{
    this.productSearchRequest.name = this.formSearchProduct.get('name')?.value;
    this.productSearchRequest.type = this.formSearchProduct.get('type')?.value;
    this.productSearchRequest.startPrice = this.formSearchProduct.get('startPrice')?.value;
    this.productSearchRequest.endPrice = this.formSearchProduct.get('endPrice')?.value;
    this.productSearchRequest.keyword = this.formSearchProduct.get('keyword')?.value;
    this.loadData();
  }

  onChangeRangePrice(): void{
    this.formSearchProduct.get('startPrice')?.setValue(this.formSearchProduct.get('rangePrice')?.value[0]);
    this.formSearchProduct.get('endPrice')?.setValue(this.formSearchProduct.get('rangePrice')?.value[1]);
  }

  formatterPrice = (value: number): string => CommonUtil.moneyFormat(value + '') + ' đ';
  parserPrice = (value: string): number => CommonUtil.formatToNumber(value);

}
