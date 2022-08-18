import { TransferItem } from 'ng-zorro-antd/transfer';
import { IProduct } from '../product.model';
import { IMenuResponse } from './menu.model';

export interface IOrderResponse {
  createdBy?: string;
  createdAt?: number;
  lastModifiedBy?: string;
  lastModifiedAt?: number;
  id?: string;
  createdUserId?: string;
  menuId?: string;
  code?: string;
  totalPrice?: number;
  status?: string;
  type?: string;
  deleted?: boolean;
  purchaseOrderItems?: IOrderItem[];
  menu?: IMenuResponse;
  purchaseOrderHistories?: IPurchaseOrderHistory[];
  userFullName?: string;
  createdUserFullName?: string;
  ownerFullName?: string;
}

export class OrderResponse implements IOrderResponse {
}

export interface IOrderRequest {
  createdUserId?: string;
  menuId?: string;
  type?: string;
  purchaseOrderItems?: [
    {
      productId?: string;
      quantity?: number;
    }
  ]
}


export class OrderRequest implements IOrderRequest {
}

export interface IOrderItem {
  id?: string;
  orderId?: string;
  productId?: string;
  createdBy?: string;
  createdAt?: number;
  lastModifiedBy?: number;
  lastModifiedAt?: number;
  purchaseOrderId?: string;
  productName?: string;
  productPrice?: number;
  quantity?: number;
  deleted?: boolean;
}

export class OrderItem implements IOrderItem {
  constructor(
    public id?: string,
    public orderId?: string,
    public productId?: string,
    public quantity?: number,
  ) {
    this.id = id;
    this.orderId = orderId;
    this.productId = productId;
    this.quantity = quantity;
  }
}

export interface IPurchaseOrderHistory {
  createdBy?: string;
  createdAt?: number;
  lastModifiedBy?: string;
  lastModifiedAt?: number;
  id?: string;
  createdUserId?: string;
  createdUserFullName?: string;
  purchaseOrderId?: string;
  status?: string;
  deleted?: boolean;
}

export interface ChangeOrderStatusRequest {
  purchaseOrderIds?: string[];
}

export interface ProductItem extends TransferItem {
  data: IProduct & { quantity?: number},
}
