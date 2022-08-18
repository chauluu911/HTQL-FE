export interface IRoleRequest {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
  hasPageable?: boolean;
  sortBy?: string;
  isRoot?: boolean;
  status?: string;
  startAt?: number;
  endAt?: number;
  createdBy?: Array<string>;
  code?: string;
  startCreatedAt?: number | null;
  endCreatedAt?: number | null;
  startLastModifiedAt?: number | null;
  endLastModifiedAt?: number | null;
}

export class RoleRequest {
  constructor(
    public keyword?: string,
    public pageIndex?: number,
    public pageSize?: number,
    public hasPageable?: boolean,
    public sortBy?: string,
    public isRoot?: boolean,
    public status?: string,
    public startAt?: number,
    public endAt?: number,
    public createdBy?: Array<string>,
    public code?: string,
    public startCreatedAt?: number | null,
    public endCreatedAt?: number | null,
    public startLastModifiedAt?: number | null,
    public endLastModifiedAt?: number | null
  ) {
    this.keyword = keyword;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.hasPageable = hasPageable;
    this.sortBy = sortBy;
    this.isRoot = isRoot;
    this.status = status;
    this.startAt = startAt;
    this.endAt = endAt;
    this.createdBy = createdBy;
    this.code = code;
    this.startCreatedAt = startCreatedAt;
    this.endCreatedAt = endCreatedAt;
    this.startLastModifiedAt = startLastModifiedAt;
    this.endLastModifiedAt = endLastModifiedAt;
  }
}
