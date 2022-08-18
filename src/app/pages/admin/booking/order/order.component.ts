import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ORDER_STATUS, ORDER_TYPE } from '@shared/constants/common.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { IMenuResponse } from '@shared/models/booking/menu.model';
import { ChangeOrderStatusRequest, IOrderResponse } from '@shared/models/booking/order.model';
import { IORderSearchRequest } from '@shared/models/request/order-search-request.model';
import { IUser } from '@shared/models/user.model';
import { FoodMenuService } from '@shared/services/booking/menu.service';
import { OrderService } from '@shared/services/booking/order.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import { ROUTER_ACTIONS, ROUTER_UTILS } from '@shared/utils/router.utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BookingCommonUtil } from '../common-booking/booking.constant';
import { SearchOrderComponent } from '../search-order/search-order.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  formSearchOrder: FormGroup = new FormGroup({});
  orders: IOrderResponse[] = [];
  orderSearchRequest: IORderSearchRequest = {
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
  };
  types = ORDER_TYPE;
  orderStatus = ORDER_STATUS;
  selectedOrderId = '';
  total = 0;
  menus: IMenuResponse[] = [];
  groupPopup = {
    title: '',
    content: '',
    okText: '',
  };

  users: IUser[] = [];

  constructor(
    private translateService: TranslateService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private modalService: NzModalService,
    private menuService: FoodMenuService,
    private userService: UserService,
    private fb: FormBuilder,
  ) {
    this.initForm();
    this.menuService.searchAutoComplete({}).subscribe((menusResponse: any) => {
      this.menus = menusResponse.body?.data;
    });
   }

  ngOnInit(): void {
    this.loadData();
  }

  initForm(): void {
    this.formSearchOrder = this.fb.group({
      type: [this.orderSearchRequest.type || null],
      status: [this.orderSearchRequest.status || null],
      menuId: [this.orderSearchRequest.menuId || null],
      startCreatedAt: [this.orderSearchRequest.startCreatedAt || null],
      endCreatedAt: [this.orderSearchRequest.endCreatedAt || null],
      userId: [this.orderSearchRequest.userId || null],
    })
  }

  private loadData() {
    this.orderService.search(this.orderSearchRequest).subscribe(
      (response: any) => {
        this.orders = response?.body?.data;
        this.total = response.body.page.total;
    })
  }

  create(): void {
    this.router.navigate([ROUTER_UTILS.booking.root, ROUTER_UTILS.booking.order, ROUTER_ACTIONS.create])
  }

  openPurchasePopup(): void {
    const form = CommonUtil.modalConfirm(
      this.translateService,
      'model.order.changeToPaid',
      'model.order.changeToPaidConfirm',
    );

    const modal: NzModalRef = this.modalService.create(form);

    modal.afterClose.subscribe((response: { success: boolean } ) => {
      if (response.success) {
        const orderIds: string[] = [];
        this.orders.forEach(order => {
          if (order.id) {
            orderIds.push(order.id);
          }
        });

        const changeStatusToPaidRequest: ChangeOrderStatusRequest = {
          purchaseOrderIds: orderIds,
        }
        this.orderService.changeStatusToPaid(changeStatusToPaidRequest).subscribe(changeStatusResponse => {
          this.toast.success('model.order.success.changeToPaid');
          this.loadData();
        });
      }
    })

  }

  update(id: string): void {
    this.router.navigate([ROUTER_UTILS.booking.root, ROUTER_UTILS.booking.order, id, ROUTER_ACTIONS.update]);
  }

  delete(id: string): void {
    const form = CommonUtil.modalConfirm(
      this.translateService,
      'model.order.deleteOrderTitle',
      'model.order.deleteOrderContent'
    );

    const modal = this.modalService.create(form);

    modal.afterClose.subscribe((result: {success: boolean}) => {
      if (result.success) {
        this.orderService.delete(id).subscribe((response: any) => {
          this.toast.success('model.order.success.delete');
          this.loadData();
        })
      }
    })
  }

  detail(id: string): void {
    this.router.navigate([ROUTER_UTILS.booking.root, ROUTER_UTILS.booking.order, id, ROUTER_ACTIONS.detail]);
  }

  pipeType(orderTypeCode: string) {
    return BookingCommonUtil.pipeOrderType(orderTypeCode);
  }

  pipeStatus(orderStatusCode: string) {
    return BookingCommonUtil.pipeOrderStatus(orderStatusCode);
  }

  formatColor(status: string): string {
    return BookingCommonUtil.formatStatusColor(status);
  }

  openAdvancedSearch(): void {
    const base = CommonUtil.modalBase(SearchOrderComponent, {

    }, '40%');
  }

  resetSearch(): void {
    this.formSearchOrder.reset();

    this.orderSearchRequest = {
      pageIndex: PAGINATION.PAGE_DEFAULT,
      pageSize: PAGINATION.SIZE_DEFAULT,
    };
    this.search();
  }

  search(): void {
    this.orderSearchRequest.type = this.formSearchOrder.get('type')?.value;
    this.orderSearchRequest.status = this.formSearchOrder.get('status')?.value;
    this.orderSearchRequest.menuId = this.formSearchOrder.get('menuId')?.value;
    this.orderSearchRequest.startCreatedAt = this.formSearchOrder.get('startCreatedAt')?.value;
    this.orderSearchRequest.endCreatedAt = this.formSearchOrder.get('enCreatedAt')?.value;
    this.orderSearchRequest.userId = this.formSearchOrder.get('userId')?.value;
    this.loadData();
  }

  onQuerySearch(params: NzTableQueryParams): void {
    const { pageIndex, pageSize } = params;
    const sortBy = CommonUtil.getSortStringFromParamObject(params);

    this.orderSearchRequest = {
      ...this.orderSearchRequest,
      pageIndex,
      pageSize,
      sortBy,
    }

    this.loadData();
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

  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.orderSearchRequest.pageIndex, this.orderSearchRequest.pageSize);
  }

  onChangeCreateDate(rangeDate: { fromDate?: Date; toDate: Date}): void {
    this.orderSearchRequest.startCreatedAt = rangeDate.fromDate?.valueOf();
    this.orderSearchRequest.endCreatedAt = rangeDate.toDate?.valueOf();
    this.formSearchOrder.get('startCreatedAt')?.setValue(rangeDate.fromDate);
    this.formSearchOrder.get('endCreatedAt')?.setValue(rangeDate.toDate);
  }
}
