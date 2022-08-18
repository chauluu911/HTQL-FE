import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  MENU_TYPE, MENU_TYPE_STR, NZ_TRANSFER_CONST,
  ORDER_STATUS_STR,
  ORDER_TYPE_STR,
  PRODUCT_SUBTYPE_STR_MAP, PRODUCT_TYPE_STR, PRODUCT_TYPE_STR_MAP
} from '@shared/constants/common.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { IMenuRequest, IMenuResponse, MenuResponse } from '@shared/models/booking/menu.model';
import { IOrderResponse } from '@shared/models/booking/order.model';
import { IProduct } from '@shared/models/product.model';
import { IORderSearchRequest } from '@shared/models/request/order-search-request.model';
import { IProductSearchRequest } from '@shared/models/request/product-search-request.model';
import { FoodMenuService } from '@shared/services/booking/menu.service';
import { OrderService } from '@shared/services/booking/order.service';
import { ProductService } from '@shared/services/booking/product.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { ROUTER_ACTIONS, ROUTER_UTILS } from '@shared/utils/router.utils';
import { TransferItem } from 'ng-zorro-antd/transfer';

@Component({
  selector: 'app-update-menu',
  templateUrl: './update-menu.component.html',
  styleUrls: ['./update-menu.component.scss']
})
export class UpdateMenuComponent implements OnInit {
  menuId = '';
  action = '';
  ROUTER_ACTIONS = ROUTER_ACTIONS;

  form: FormGroup = new FormGroup({});
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  types = MENU_TYPE;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private toast: ToastService,
    private menuService: FoodMenuService,
    private orderService: OrderService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.data.subscribe(res => {
      this.action = res.action;
    })

    this.route.paramMap.subscribe((response) => {
      this.menuId = response.get('id') || '';
    });
  }

  status = false;
  statusIsLoading = false;

  MENU_TYPE_STR = MENU_TYPE_STR;

  productsInAllMenu: IProduct[] = [];
  products: IProduct[] = [];
  productDisplayList: TransferItem[] = [];
  productSearchRequest: IProductSearchRequest = {
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
  };

  startValue: Date | null = null;

  menu: IMenuResponse = new MenuResponse();
  orders: IOrderResponse[] = [];
  orderSearchRequest: IORderSearchRequest = {
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
  }

  search(ret: {}): void {
  }

  ngOnInit(): void {
    this.fetchProducts();
    if (this.action === ROUTER_ACTIONS.detail) {
      this.fetchMenuDetailAndInitForm();
    } else if (this.action === ROUTER_ACTIONS.update) {
      this.fetchMenuUpdateAndInitForm();
    } else {
      // create
      this.initForm();
      this.onChangeMenuType();
      this.onMenuTypeChanged(this.form.get('type')?.value);
    }
  }

  fetchMenuDetailAndInitForm(): void {
    this.menuService.getById(this.menuId).subscribe(
      (response: any) => {
        this.menu = response.body.data;
        this.initForm(this.menu);
        this.onMenuTypeChanged(this.form.get('type')?.value);
        // detail only
        this.orderService.search({ menuId: this.menuId, }).subscribe((orderResponse: any) => {
          this.orders = orderResponse.body.data;
        })
        this.disableMenuFormFields();
      }
    );
  }

  fetchMenuUpdateAndInitForm(): void {
    this.menuService.getById(this.menuId).subscribe(
      (response: any) => {
        this.menu = response.body.data;
        this.initForm(this.menu);
        this.onChangeMenuType();
        this.onMenuTypeChanged(this.form.get('type')?.value);
      }
    );
  }

  /**
   * Khởi tạo danh sách sản phẩm khi kiểu thực đơn thay đổi cho 3 trường hợp: xem chi tiết, thêm mới, cập nhật
   * @param menuType: kiểu của thực đơn
   */
  onMenuTypeChanged(menuType: string): void {
    if (this.action === ROUTER_ACTIONS.detail) {
      this.products = this.productsInAllMenu
      .filter((product: IProduct) => product.id && this.extractProductIdsFromMenu().includes(product.id))
    } else {
      // if menu type is food then disable price
      if (menuType === MENU_TYPE_STR.MENU_FOOD) {
        this.form.get('price')?.disable();
      } else {
        this.form.get('price')?.enable();
      }
      // update product list
      this.products = menuType
        ?
          this.productsInAllMenu
          .filter((product: IProduct) => this.checkProductTypeIsMenuType(product.type, menuType))
        : this.productsInAllMenu;

      this.productDisplayList = this.products.filter((product: IProduct) => !!product.id).map((product: IProduct) => ({
        title: product.name || '',
        key: product.id,
        direction: (product.id &&  this.extractProductIdsFromMenu().includes(product.id))
          ? NZ_TRANSFER_CONST.RIGHT
          : NZ_TRANSFER_CONST.LEFT,
      }));
    }
  }

  /**
   * Lắng nghe sự kiện thay đổi kiểu của thực đơn
   */
  onChangeMenuType(): void {
    this.form.controls.type?.valueChanges.subscribe((t) => {
      this.onMenuTypeChanged(t);
    })
  }

  checkProductTypeIsMenuType(productType: string | undefined, type: string): boolean {
    if (!productType) {
      return false;
    }
    const check =  (type === this.MENU_TYPE_STR.MENU_FOOD && productType === PRODUCT_TYPE_STR.FOOD)
                || (type === this.MENU_TYPE_STR.MENU_LUNCH && productType === PRODUCT_TYPE_STR.LUNCH);

    return check;
  }

  /**
   * lấy ra danh sách hiên thị các sản phẩm có trong menu dựa vào kiểu menu
   * @param menuType : kiểu menu
   */
  initTransferList(menuType: string): void {
    this.products = menuType ? this.productsInAllMenu
      .filter((product) => product.type === menuType) : this.productsInAllMenu;
    this.productDisplayList = this.products
      .map((product) => this.productToItemLeftRight(product, this.extractProductIdsFromMenu()));
  }

  fetchProducts(): void {
    this.productService.search({}).subscribe(
      (response: any) => {
        const data = response?.body?.data;
        this.productsInAllMenu = data;
      }
    );
  }

  extractProductIdsFromMenu(): string[] {
    return this.menu.menuProducts?.map(product => product.productId) || [];
  }

  productToItemLeftRight(product: IProduct, productIds: string[]): TransferItem {
    return {
      key: product.id,
      title: product.name || '',
      direction: (product.id && productIds.includes(product.id)) ? NZ_TRANSFER_CONST.RIGHT : NZ_TRANSFER_CONST.LEFT,
    };
  }

  initForm(formData?: IMenuResponse): void {
    this.form = this.fb.group({
      title: [formData?.title],
      type: [formData?.type],
      price: [formData?.price],
      productIds: [formData?.products?.map((product: IProduct) => product.id)],
      closedAt: [formData?.closedAt],
      published: [formData?.published],
      menuFileIds: [[]],
      note: [formData?.note],
    });

    this.status = formData?.published || false;
  }

  onCancel(): void {
    window.history.back();
  }

  onSubmit(): void {
    const menu: IMenuRequest = {
      ...this.form.value
    }

    this.enrichMenuRequest(menu);

    this.menuService.create(menu).subscribe((response: any) => {
      this.toast.success('model.menu.success.create');
      window.history.back();
    });
  }

  onUpdateSubmit(): void {
    const menu: IMenuRequest = {
      ...this.form.value
    }

    this.enrichMenuRequest(menu);

    this.menuService.update(this.menu.id || '', menu).subscribe((response: any) => {
      this.toast.success('model.menu.success.update');
      window.history.back();
    });
  }

  private enrichMenuRequest(menu: IMenuRequest): void {
    menu.closedAt = menu.closedAt?.valueOf();
    const newProductIds = this.productDisplayList.filter((item) => item.direction === NZ_TRANSFER_CONST.RIGHT).map((item) => item.key);
    const menuProductRequests = newProductIds.map(id => {
      return {
        productId: id,
        maxProductPurOrder: 1,
      }
    });
    menu.menuProductRequests = menuProductRequests;
  }

  private disableMenuFormFields() {
    this.form.get('title')?.disable();
    this.form.get('type')?.disable();
    this.form.get('price')?.disable();
    this.form.get('productIds')?.disable();
    this.form.get('closedAt')?.disable();
    this.form.get('menuFileIds')?.disable();
    this.form.get('note')?.disable();
    if (this.action === this.ROUTER_ACTIONS.detail) {
      this.form.get('productIds')?.disable();
    }
  }

  onChange(result: Date): void {
  }

  onPublishChange() {
    this.statusIsLoading = true;
    if (this.isPublished(this.status)) {
      this.unpublish(this.menuId);
    } else {
      this.publish(this.menuId);
    }
  }

  private isPublished(status: boolean) {
    return status;
  }

  publish(id: string): void {
    this.menuService.publish(id).subscribe(
      (response: any) => {
        this.toast.success('model.menu.success.publish');
        this.status = true;
        this.statusIsLoading = false;
      },
    );
  }

  unpublish(id: string): void {
    this.menuService.unpublish(id).subscribe(
      (response: any) => {
        this.toast.success('model.menu.success.unpublish');
        this.status = false;
        this.statusIsLoading = false;
      },
    );
  }


  pipeType(type: string): string {
    return PRODUCT_TYPE_STR_MAP[type];
  }

  pipeSubtype(type: string): string {
    return PRODUCT_SUBTYPE_STR_MAP[type];
  }

  onQuerySearchProducts(): void {
    //
  }

  onQuerySearchOrders(): void {
    //
  }

  pipeOrderType(orderTypeCode: string) {
    return ORDER_TYPE_STR[orderTypeCode];
  }

  pipeOrderStatus(orderStatusCode: string) {
    return ORDER_STATUS_STR[orderStatusCode];
  }

  navigateToUpdatePage() {
    this.router.navigate([ROUTER_UTILS.booking.root, ROUTER_UTILS.booking.menu, this.menuId, ROUTER_ACTIONS.update]);
  }

}
