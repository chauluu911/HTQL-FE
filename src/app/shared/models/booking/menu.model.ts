import { IProduct } from '../product.model';
import { IOrderItem } from './order.model';


export interface IMenuRequest {
  id?: string;
  type?: string;
  title?: string;
  price?: number;
  closedAt?: Date | number;
  isClosed?: boolean;
  menuFileIds?: string[];
  note?: string;
  published?: boolean;
  maxTotalPricePurOrder?: number;
  menuProductRequests?: MenuProductRequest[];
}

export class MenuRequest implements IMenuRequest {
  constructor(
    public id?: string,
    public type?: string,
    public productIds?: [],
    public title?: string,
    public price?: number,
    public closedAt?: Date | number,
    public isClosed?: boolean,
    public menuFileIds?: string[],
    public note?: string,
    public published?: boolean,
  ) {
    this.id = id;
    this.type = type;
    this.productIds = productIds;
    this.title = title;
    this.price = price;
    this.closedAt = closedAt;
    this.isClosed = isClosed;
    this.menuFileIds = menuFileIds;
    this.note = note;
    this.published = published;
  }
}


export interface IMenuResponse {
  createdBy?: string;
  createdAt?: number;
  lastModifiedBy?: string;
  lastModifiedAt?: number;
  id?: string;
  code?: string;
  title?: string;
  products?: IProduct[];
  price?: number;
  closedAt?: number;
  status?: string;
  type?: string;
  note?: string;
  maxTotalPricePurchaseOrder?: number;
  published?: boolean;
  deleted?: false;
  menuProducts?: MenuProduct[],
  purchaseOrderItems?: IOrderItem[]
  // orderList: [
  //   {
  //     createdBy: string;
  //     createdAt: number;
  //     lastModifiedBy: string;
  //     lastModifiedAt: number;
  //     id: string;
  //     menuId: string;
  //     totalMoney: number;
  //     status: string;
  //     deleted: false
  //   },
  //   {
  //     createdBy: string;
  //     createdAt: number;
  //     lastModifiedBy: string;
  //     lastModifiedAt: number;
  //     id: string;
  //     menuId: string;
  //     totalMoney: number;
  //     status: string;
  //     deleted: false
  //   }
  // ],
}

export class MenuResponse implements IMenuResponse {
  constructor(
    public createdBy?: string,
    public createdAt?: number,
    public lastModifiedBy?: string,
    public lastModifiedAt?: number,
    public id?: string,
    public code?: string,
    public title?: string,
    public products?: IProduct[],
    public price?: number,
    public closedAt?: number,
    public status?: string,
    public type?: string,
    public note?: string,
    public maxTotalPricePurchaseOrder?: number,
    public published?: boolean,
    public deleted?: false,
    public menuProducts?: MenuProduct[],
    public purchaseOrderItems?: IOrderItem[],
  ) {
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.lastModifiedBy = lastModifiedBy;
    this.lastModifiedAt = lastModifiedAt;
    this.id = id;
    this.code = code;
    this.title = title;
    this.products = products;
    this.price = price;
    this.closedAt = closedAt;
    this.status = status;
    this.type = type;
    this.note = note;
    this.maxTotalPricePurchaseOrder = maxTotalPricePurchaseOrder;
    this.published = published;
    this.deleted = deleted;
    this.menuProducts = menuProducts;
    this.purchaseOrderItems = purchaseOrderItems;
  }
}

export interface MenuProduct {
  createdBy?: string;
  createdAt?: number;
  lastModifiedBy?: string;
  lastModifiedAt?: number;
  id?: string;
  name?: string;
  deleted?: false;
  menuId: string;
  productId: string;
}

export interface MenuProductRequest {
  productId: string;
  maxProductPurOrder: number;
}
