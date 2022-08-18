export interface IProductSearchRequest {
 name?: string;
 type?: string;
 startPrice?: number;
 endPrice?: number;
 pageIndex?: number;
 pageSize?: number;
 sortBy?: string;
 keyword?: string;
}

export class ProductSearchRequest {
  constructor(
    public name?: string,
    public type?: string,
    public startPrice?: number,
    public endPrice?: number,
    public pageIndex?: number,
    public pageSize?: number,
    public sortBy?: string,
    public keyword?: string,

  ) {
    this.name = name;
    this.type = type;
    this.startPrice = startPrice;
    this.endPrice = endPrice;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.sortBy = sortBy;
    this.keyword = keyword;
  }
}
