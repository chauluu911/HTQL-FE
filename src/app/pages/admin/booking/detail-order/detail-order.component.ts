import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PRODUCT_TYPE_STR } from '@shared/constants/common.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { IMenuResponse, MenuResponse } from '@shared/models/booking/menu.model';
import { IOrderItem, IOrderResponse, IPurchaseOrderHistory, OrderResponse } from '@shared/models/booking/order.model';
import { FoodMenuService } from '@shared/services/booking/menu.service';
import { MockService } from '@shared/services/booking/mock.service';
import { OrderService } from '@shared/services/booking/order.service';
import CommonUtil from '@shared/utils/common-utils';
import { ROUTER_ACTIONS, ROUTER_UTILS } from '@shared/utils/router.utils';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BookingCommonUtil } from '../common-booking/booking.constant';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.scss']
})
export class DetailOrderComponent implements OnInit {

  orderId = '';
  order: IOrderResponse = new OrderResponse();
  menu: IMenuResponse = new MenuResponse();

  PRODUCT_TYPE_STR = PRODUCT_TYPE_STR;

  purchaseOrderItemSearchRequest = {
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    sortBy: '',
  };
  totalOrderItem?: number = 0;
  purchaseOrderItems?: IOrderItem[];

  purchaseOrderHistoryRequest = {
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    sortBy: '',
  };
  totalOrderHistories?: number = 0;
  purchaseOrderHistories?: IPurchaseOrderHistory[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private menuService: FoodMenuService,
    private mockService: MockService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((response) => {
      this.orderId = response.get('id') || '';
    });
    this.orderService.getById(this.orderId).subscribe((response: any) => {
      this.order = response.body.data;
      this.totalOrderHistories = this.order.purchaseOrderHistories?.length;
      this.loadHistories();
      this.loadProducts();
      this.totalOrderItem = this.order.purchaseOrderItems?.length;
      this.menuService.getById(this.order.menuId || '').subscribe(menuResponse => {
        this.menu = menuResponse?.body?.data as IMenuResponse;
      })
    })
  }

  formatColor(status: string): string {
    return BookingCommonUtil.formatStatusColor(status);
  }

  onCancel(): void {
    window.history.back();
  }

  navigateToUpdatePage(): void {
    this.router.navigate([ROUTER_UTILS.booking.root, ROUTER_UTILS.booking.order, this.orderId, ROUTER_ACTIONS.update]);
  }

  pipeStatus(status: string): string {
    return BookingCommonUtil.pipeOrderStatus(status);
  }

  pipeOrderType(status: string): string {
    return BookingCommonUtil.pipeOrderType(status);
  }

  onChangePaginationProduct(params: NzTableQueryParams): void {
    const { pageIndex, pageSize } = params;

    if (pageIndex && pageSize) {
      this.purchaseOrderItemSearchRequest = {
        ...this.purchaseOrderItemSearchRequest,
        pageIndex,
        pageSize,
      }
    }

    this.loadProducts();
  }

  onChangePaginationHistory(params: NzTableQueryParams): void {
    const { pageIndex, pageSize } = params;

    if (pageIndex && pageSize) {
      this.purchaseOrderHistoryRequest = {
        ...this.purchaseOrderHistoryRequest,
        pageIndex,
        pageSize,
      }
    }

    this.loadHistories();
  }

  onChangeSortProduct(params: NzTableQueryParams): void {
    const sortBy = CommonUtil.getSortStringFromParamObject(params);

    if (sortBy) {
      this.purchaseOrderItemSearchRequest = {
        ...this.purchaseOrderItemSearchRequest,
        sortBy,
      }
    }

    this.loadProducts();
  }

  onChangeSortHistory(params: NzTableQueryParams): void {

    const sortBy = CommonUtil.getSortStringFromParamObject(params);
    if (sortBy) {
      this.purchaseOrderHistoryRequest = {
        ...this.purchaseOrderHistoryRequest,
        sortBy,
      }
    }

    this.loadHistories();
  }

  loadProducts(): void {
    this.mockService.sortAndPaginateItems<IOrderItem>(this.purchaseOrderItemSearchRequest, this.order.purchaseOrderItems || [])
      .subscribe(response => {
      this.purchaseOrderItems = response.body?.data;
    });
  }

  loadHistories(): void {
    this.mockService.sortAndPaginateItems<IPurchaseOrderHistory>(this.purchaseOrderHistoryRequest,
    this.order.purchaseOrderHistories || []).subscribe(response => {
      this.purchaseOrderHistories = response.body?.data;
    });
  }

  getHistoryIndex(index: number): number {
    return CommonUtil.getIndex(index, this.purchaseOrderHistoryRequest.pageIndex, this.purchaseOrderHistoryRequest.pageSize);
  }

  getItemIndex(index: number): number {
    return CommonUtil.getIndex(index, this.purchaseOrderItemSearchRequest.pageIndex, this.purchaseOrderItemSearchRequest.pageSize);
  }

}
