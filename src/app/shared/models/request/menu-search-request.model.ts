export interface IMenuSearchRequest {
  title?: string;
  type?: string;
  published?: boolean;
  startClosedAt?: number;
  endClosedAt?: number;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  keyword?: string;
}


export class MenuSearchRequest implements IMenuSearchRequest {
  constructor(
    public title?: string,
    public type?: string,
    public published?: boolean,
    public pageIndex?: number,
    public pageSize?: number,
    public sortBy?: string,
    public startClosedAt?: number,
    public endClosedAt?: number,
    public keyword?: string,
  ) {
    this.title = title;
    this.type = type;
    this.startClosedAt = startClosedAt;
    this.endClosedAt = endClosedAt;
    this.published = published;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.sortBy = sortBy;
    this.keyword = keyword;
  }
}
