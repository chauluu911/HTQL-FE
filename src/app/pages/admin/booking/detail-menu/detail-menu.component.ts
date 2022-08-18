import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MENU_TYPE_STR, ORDER_STATUS_CONST } from '@shared/constants/common.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { IMenuResponse, MenuResponse } from '@shared/models/booking/menu.model';
import { ChangeOrderStatusRequest, IOrderResponse } from '@shared/models/booking/order.model';
import { IProduct } from '@shared/models/product.model';
import { IORderSearchRequest } from '@shared/models/request/order-search-request.model';
import { IProductSearchRequest } from '@shared/models/request/product-search-request.model';
import { FoodMenuService } from '@shared/services/booking/menu.service';
import { MockService } from '@shared/services/booking/mock.service';
import { OrderService } from '@shared/services/booking/order.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { ROUTER_ACTIONS, ROUTER_UTILS } from '@shared/utils/router.utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BookingCommonUtil } from '../common-booking/booking.constant';

@Component({
  selector: 'app-detail-menu',
  templateUrl: './detail-menu.component.html',
  styleUrls: ['./detail-menu.component.scss']
})
export class DetailMenuComponent implements OnInit {

  menuId = '';
  menu: IMenuResponse = new MenuResponse();
  published = false;
  statusIsLoading = false;

  LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  MENU_TYPE_STR = MENU_TYPE_STR;


  displayProducts?: IProduct[] = [];
  productSearchRequest: IProductSearchRequest = {
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
  };

  orders: IOrderResponse[] = [];
  totalOrders = 0;
  orderSearchRequest: IORderSearchRequest = {
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
  }

  ORDER_STATUS_CONST = ORDER_STATUS_CONST;

  selectedOrders: IOrderResponse[] = [];
  publishPopup = {
    title: '',
    content: '',
    okText: '',
    interpolateParams: {},
  };
  action: any;
  isPubUnpubPopupVisible = false;
  unpublish = false;

  revertToOrderPopup = {
    title: '',
    content: '',
    okText: '',
    interpolateParams: {},
  };
  isRevertToOrderPopupVisible = false;
  revertToOrderIsLoading = false;
  revertToOrder = false;

  changeToPaidPopup = {
    title: '',
    content: '',
    okText: '',
    interpolateParams: {},
  };
  isChangeToPaidPopupVisible = false;
  changeToPaidIsLoading = false;
  changeToPaid = false;

  isFirstLoadProducts = true;
  isFirstLoadOrders = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private menuService: FoodMenuService,
    private orderService: OrderService,
    private toast: ToastService,
    private translateService: TranslateService,
    private modalService: NzModalService,
    private mockService: MockService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((response) => {
      this.menuId = response.get('id') || '';
    });
    this.loadData();
  }

  loadData() {
    this.menuService.getById(this.menuId).subscribe((response: any) => {
      this.menu = response.body.data;

      this.published = this.menu.published || false;
      this.orderSearchRequest = {
        ...this.orderSearchRequest,
        menuId: this.menuId
      };
      this.loadOrders();
    })
  }

  navigateToUpdatePage() {
    this.router.navigate([ROUTER_UTILS.booking.root, ROUTER_UTILS.booking.menu, this.menu.id, ROUTER_ACTIONS.update]);
  }

  onCancel(): void {
    window.history.back();
  }

  openPubUnpubPopup(): void {
    if (this.isPublished(this.published)) {
      this.publishPopup = {
        title: 'model.menu.unpublish',
        content: 'model.menu.unpublishConfirm',
        interpolateParams: { title: `<b>${this.menu.title || ''}</b>` },
        okText: 'action.confirm',
      };
    } else {
      this.publishPopup = {
        title: 'model.menu.publish',
        content: 'model.menu.publishConfirm',
        interpolateParams: { title: `<b>${this.menu.title || ''}</b>` },
        okText: 'action.confirm',
      };
    }
    this.isPubUnpubPopupVisible = true;
  }

  onPubUnpubModalClosed(result: {success: boolean}): void {
    if (result.success) {
      this.statusIsLoading = true;
      if (this.isPublished(this.published)) {
        this.menuService.unpublish(this.menu.id || '').subscribe(
          (response: any) => {
            this.toast.success('model.menu.success.unpublish');
            this.published = false;
            this.statusIsLoading = false;
          },
        );
      } else {
        this.menuService.publish(this.menu.id || '').subscribe(
          (response: any) => {
            this.toast.success('model.menu.success.publish');
            this.published = true;
            this.statusIsLoading = false;
          },
        );
      }
    }
    this.isPubUnpubPopupVisible = false;
  }

  openRevertToOrderPopup(item: IOrderResponse): void {
    this.revertToOrderPopup = {
      title: 'model.order.revertToOrder',
      content: 'model.order.revertToOrderConfirm',
      interpolateParams: { title: `<b>${this.menu.title || ''}</b>` },
      okText: 'action.confirm',
    };
    this.selectedOrders = [item];
    this.revertToOrderIsLoading = true;
    this.isRevertToOrderPopupVisible = true;
  }


  onRevertToOrderPopupClosed(result: { success: boolean}) {
    if (result.success) {
      const purchaseOrderIds: string[] = [];
      this.selectedOrders.forEach((item) => {
        if (item.id) {
          purchaseOrderIds.push(item.id);
        }
      });
      const changeOrderStatusRequest: ChangeOrderStatusRequest = {
        purchaseOrderIds,
      }
      this.orderService.revertStatusToOrder(changeOrderStatusRequest).subscribe((response) => {
        this.orderService.search({ menuId: this.menuId, }).subscribe((orderResponse: any) => {
          this.orders = orderResponse.body.data;
          this.toast.success('model.order.success.revertToOrder');
        })
      });
    }
    this.revertToOrderIsLoading = false;
    this.isRevertToOrderPopupVisible = false;
  }

  // if item is undefined, apply to all orders
  openChangeToPaidPopup(item: IOrderResponse): void {
    this.changeToPaidPopup = {
      title: 'model.order.changeToPaid',
      content: 'model.order.changeToPaidConfirm',
      interpolateParams: { title: `<b>${this.menu.title || ''}</b>` },
      okText: 'action.confirm',
    };
    this.selectedOrders = [item];
    this.changeToPaidIsLoading = true;
    this.isChangeToPaidPopupVisible = true;
  }


  onChangeToPaidPopupClosed(result: { success: boolean}) {
    if (result.success) {
      const purchaseOrderIds: string[] = [];
      this.selectedOrders.forEach((item) => {
        if (item.id) {
          purchaseOrderIds.push(item.id);
        }
      });
      const changeOrderStatusRequest: ChangeOrderStatusRequest = {
        purchaseOrderIds,
      }
      this.orderService.changeStatusToPaid(changeOrderStatusRequest).subscribe((response) => {
        this.orderService.search({ menuId: this.menuId, }).subscribe((orderResponse: any) => {
          this.orders = orderResponse.body.data;
          this.toast.success('model.order.success.changeToPaid');
        })
      });
    }
    this.changeToPaidIsLoading = false;
    this.isChangeToPaidPopupVisible = false;
  }

  private isPublished(status: boolean) {
    return status;
  }

  openCommitMenuPopup(): void {
    const form = CommonUtil.modalConfirm(
      this.translateService,
      'model.order.commitMenu',
      'model.order.commitMenuConfirm',
    );

    const modal: NzModalRef = this.modalService.create(form);
    modal.afterClose.subscribe((result: {success: boolean}) => {
      if (result.success) {
        this.menuService.commit(this.menuId).subscribe(response => {
          this.toast.success('model.menu.success.commit');
          this.loadData();
        })
      }
    })
  }


  onChangeProductSearchParams(params: NzTableQueryParams): void {
    // if (this.isFirstLoadProducts) {
    //   this.isFirstLoadProducts = false;
    //   return;
    // }

    const sortBy = CommonUtil.getSortStringFromParamObject(params);
    const { pageIndex, pageSize } = params;
    this.productSearchRequest = {
      ...this.productSearchRequest,
      sortBy,
      pageIndex,
      pageSize,
    }
    this.loadProducts();
  }

  loadProducts(): void {
    this.mockService.sortAndPaginateItems<IProduct>(this.productSearchRequest, this.menu.products || []).subscribe((response) => {
      this.displayProducts = response.body?.data;
    });
  }

  onChangeOrderSearchParams(params: NzTableQueryParams): void {
    if (this.isFirstLoadOrders) {
      this.isFirstLoadOrders = false;
      return;
    }

    const sortBy = CommonUtil.getSortStringFromParamObject(params);
    const { pageIndex, pageSize } = params;
    this.orderSearchRequest = {
      ...this.orderSearchRequest,
      sortBy,
      pageIndex,
      pageSize,
    }
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.search(this.orderSearchRequest).subscribe((orderResponse: any) => {
      this.orders = orderResponse.body.data;
      this.totalOrders = orderResponse.body.page.total as number;
    });
  }

  pipeType(type: string) {
    return BookingCommonUtil.pipeMenuType(type);
  }

  pipeSubtype(type: string) {
    return BookingCommonUtil.pipeProductSubtype(type);
  }

  pipeOrderStatus(type: string) {
    return BookingCommonUtil.pipeOrderStatus(type);
  }

  pipeOrderType(type: string) {
    return BookingCommonUtil.pipeOrderType(type);
  }

  getProductList(menu: IMenuResponse): string {
    const purchaseOrderItems = menu.purchaseOrderItems || [];
    const productList = purchaseOrderItems.map((item) => {
      return item.productName;
    });

    return productList.join(', ');
  }

  formatColor(status: string): string {
    return BookingCommonUtil.formatStatusColor(status);
  }

  getProductIndex(index: number): number {
    return CommonUtil.getIndex(index, this.productSearchRequest.pageIndex, this.productSearchRequest.pageSize);
  }

  getOrderIndex(index: number): number {
    return CommonUtil.getIndex(index, this.orderSearchRequest.pageIndex, this.orderSearchRequest.pageSize);
  }
}
