export interface IORderSearchRequest {
  type?: string;
  status?: string;
  startCreatedAt?: number;
  endCreatedAt?: number;
  menuId?: string;
  userId?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
}


export class OrderSearchRequest implements IORderSearchRequest {
  constructor(
    public type?: string,
    public status?: string,
    public startCreatedAt?: number,
    public endCreatedAt?: number,
    public menuId?: string,
    public userId?: string,
    public pageIndex?: number,
    public pageSize?: number,
    public sortBy?: string,
  ) {
    this.type = type;
    this.status = status;
    this.startCreatedAt = startCreatedAt;
    this.endCreatedAt = endCreatedAt;
    this.menuId = menuId;
    this.userId = userId;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.sortBy = sortBy;
  }
}
