import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MENU_TYPE_STR, NZ_TRANSFER_CONST, ORDER_TYPE, ORDER_TYPE_CONST, PRODUCT_TYPE_STR } from '@shared/constants/common.constant';
import { LOCAL_STORAGE } from '@shared/constants/local-session-cookies.constants';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { IMenuResponse } from '@shared/models/booking/menu.model';
import { IOrderRequest, IOrderResponse, OrderResponse, ProductItem } from '@shared/models/booking/order.model';
import { IProduct } from '@shared/models/product.model';
import { IUser, User } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth/auth.service';
import { FoodMenuService } from '@shared/services/booking/menu.service';
import { OrderService } from '@shared/services/booking/order.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import { ROUTER_ACTIONS } from '@shared/utils/router.utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { TransferItem } from 'ng-zorro-antd/transfer';
import { LocalStorageService } from 'ngx-webstorage';
import { BookingCommonUtil, DEFAULT_QUANTITY, FOOD_PLACEHOLDER_FILE, SVG_FILE_EXTENSION } from '../common-booking/booking.constant';
import { DetailProductComponent } from '../detail-product/detail-product.component';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.scss']
})
export class UpdateOrderComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  orderId = '';
  order: IOrderResponse = new OrderResponse();
  allProducts: IProduct[] = [];
  productsFilteredByMenu: ProductItem[] = [];
  selectedProducts: ProductItem[] = [];
  menus: IMenuResponse[] = [];
  action = '';
  ROUTER_ACTIONS = ROUTER_ACTIONS;

  ORDER_TYPES = ORDER_TYPE;

  users: IUser[] = [];
  currentUser: IUser = new User();
  userSearchRequest: {} = {};

  LENGTH_VALIDATOR = LENGTH_VALIDATOR;

  PRODUCT_TYPE_STR = PRODUCT_TYPE_STR;

  NZ_TRANSFER_CONST = NZ_TRANSFER_CONST;

  DEFAULT_QUANTITY = DEFAULT_QUANTITY;

  foodPlaceholderUrl = FOOD_PLACEHOLDER_FILE;


  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private menuService: FoodMenuService,
    private userService: UserService,
    private authService: AuthService,
    private modalService: NzModalService,
    private $localStorage: LocalStorageService,
  ) {
    this.route.data.subscribe(res => {
      this.action = res.action;
    })
    this.route.paramMap.subscribe((response) => {
      this.orderId = response.get('id') || '';
    });
    this.currentUser = this.$localStorage.retrieve(LOCAL_STORAGE.PROFILE);
  }

  ngOnInit(): void {
    if (this.action === ROUTER_ACTIONS.create) {
      this.initForm();

      this.form.get('menuId')?.disable();
      this.form.get('createdUserId')?.setValue(this.currentUser.id);

      this.onChangeOrderType();
      this.onChangeMenu();
      if (this.authService.hasAnyAuthority((['user:view']))) {
        this.userService.search(this.userSearchRequest).subscribe((response: any) => {
          this.users = response.body.data;
        });
      } else {
        this.form.get('menuId')?.disable();
        this.form.get('createdUserId')?.setValue(this.currentUser.id);

        this.onChangeOrderType();
        this.onChangeMenu();
      }

    } else if (this.action === ROUTER_ACTIONS.update) {
      this.fetchOrderAndInitFormUpdate();
    } else {
    }
  }

  fetchOrderAndInitFormUpdate(): void {
    this.orderService.getById(this.orderId).subscribe((orderResponse: any) => {
      this.order = orderResponse.body?.data;
      this.initForm(this.order);

      if (this.authService.hasAnyAuthority((['user:view']))) {
        this.userService.search().subscribe(response => {
          this.users = response?.body?.data as Array<User>;
          this.users = [{
            id: this.order.createdUserId,
            fullName: this.order.createdUserFullName,
          }, ...this.users];


          const menuId = this.order.menuId;
          const orderType = this.order?.type;
          const menuType = this.mapToMenuTypeFromOrderType(orderType || '');
          this.menuService.search({type: menuType}).subscribe((menusResponse) => {
            this.menus = menusResponse.body?.data;
            this.onMenuChanged(menuId || '');
          });
        });
      } else {
        const menuId = this.order.menuId;
        const orderType = this.order?.type;
        const menuType = this.mapToMenuTypeFromOrderType(orderType || '');
        this.menuService.search({type: menuType}).subscribe((menusResponse) => {
          this.menus = menusResponse.body?.data;
          this.onMenuChanged(menuId || '');
        });
      }
    });
  }

  onChangeOrderType(): void {
    this.form.controls.type?.valueChanges.subscribe((value) => {
      this.onOrderTypeChanged(value);
    });
  }

  onOrderTypeChanged(orderType: string): void {
    this.form.get('menuId')?.reset();
    const menuType = this.mapToMenuTypeFromOrderType(orderType);
    this.menuService.search({type: menuType, published: true}).subscribe((response) => {
      this.menus = response.body?.data;
      this.form.get('menuId')?.enable();
    });
  }

  onChangeMenu(): void {
    this.form.controls.menuId?.valueChanges.subscribe((value) => {
      this.onMenuChanged(value);
    });
  }

  onMenuChanged(menuId: string): void {
    const selectedMenu = this.menus.find((menu: IMenuResponse) => menu.id === menuId);
    this.allProducts = selectedMenu?.products || [];

    this.productsFilteredByMenu = this.allProducts
      .map((product: IProduct) => {
        const existingOrderItem = this.order.purchaseOrderItems?.find(orderItem => orderItem.productId === product.id);
        return {
          title: product.name || '',
          key: product.id,
          direction: existingOrderItem ? NZ_TRANSFER_CONST.RIGHT : NZ_TRANSFER_CONST.LEFT,
          data: {
            quantity: existingOrderItem ? existingOrderItem?.quantity : DEFAULT_QUANTITY,
            ...product,
          },
        };
      });
    this.onChangeOrderItems({});
  }

  onChangeOrderItems(ret: {}): void {
    this.selectedProducts = this.productsFilteredByMenu
      .filter((item: TransferItem) => item.direction === NZ_TRANSFER_CONST.RIGHT);
  }

  onUpdateSubmit(): void {
    const updateOrderRequest: IOrderRequest = {
      ...this.form.value,
      // createdUserId: this.currentUser.id,
      purchaseOrderItems: this.selectedProducts.map((item: ProductItem) => ({
        productId: item.key,
        quantity: parseInt((item.data.quantity || '1') as string, 10),
      })),
    };
    this.orderService.update(this.orderId, updateOrderRequest).subscribe((response: any) => {
      this.toast.success('model.order.success.update');
      window.history.back();
    });
  }

  onSubmit(): void {
    const updateOrderRequest: IOrderRequest = {
      ...this.form.value,
      // createdUserId: this.currentUser.id,
      purchaseOrderItems: this.selectedProducts.map((item: ProductItem) => ({
        productId: item.key,
        quantity: parseInt((item.data.quantity || '1') as string, 10),
      })),
    };
    this.orderService.create(updateOrderRequest).subscribe((response: any) => {
      this.toast.success('model.order.success.create');
      window.history.back();
    });
  }

  onCancel(): void {
    window.history.back();
  }

  private initForm(formData?: IOrderResponse) {
    this.form = this.fb.group({
      createdUserId: [formData?.createdUserId || this.currentUser.id],
      menuId: [
        {
          value: formData?.menuId,
          disabled: true,
        }
      ],
      type: [formData?.type],
      // purchaseOrderItems: [formData?.purchaseOrderItems?.map(item => item.productName).join(',')]
    });
  }

  private mapToMenuTypeFromOrderType(orderType: string): string {
    if (orderType === ORDER_TYPE_CONST.ORDER_BUFFET) {
      return MENU_TYPE_STR.MENU_LUNCH;
    } else if (orderType === ORDER_TYPE_CONST.ORDER_SET) {
      return MENU_TYPE_STR.MENU_FOOD;
    } else {
      return '';
    }
  }

  pipeStatus(orderStatusCode: string) {
    return BookingCommonUtil.pipeOrderStatus(orderStatusCode);
  }

  pipeProductType(productType: string) {
    return BookingCommonUtil.pipeProductType(productType);
  }

  formatColor(status: string): string {
    return BookingCommonUtil.formatStatusColor(status);
  }

  searchUsers(keyword: string): void {
    const options = {
      keyword
    };
    this.userService
      .searchUsersAutoComplete(options, false)
      .subscribe(res => {
        this.users = res.body?.data as Array<IUser>;
      });
  }

  $asTransferItems = (data: unknown): TransferItem[] => data as TransferItem[];

  onChangeQuantity(): void {

  }

  showProductDetail(product: IProduct): void {
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

  getImageUrl(imageUrl: string) {
    if (imageUrl) {
      return `${imageUrl}?token=${this.authService.getToken()}`;
    } else {
      return this.foodPlaceholderUrl;
    }
  }

  imageIsSVG(imageUrl: string) {
    if (!imageUrl) {
      return false;
    }
    const ext = imageUrl.split('.').slice(-1)[0].toLowerCase();
    return ext === SVG_FILE_EXTENSION;
  }

}
