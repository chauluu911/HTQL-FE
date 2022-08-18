export interface IDepartmentRequest {
  keyword?: string;
  ids?: string[];
  pageIndex?: number;
  pageSize?: number;
  hasPageable?: boolean;
  sortBy?: string;
  startAt?: number;
  endAt?: number;
  createdBy?: Array<string>;
  status?: string;
  startCreatedAt?: number | null;
  endCreatedAt?: number | null;
  startLastModifiedAt?: number | null;
  endLastModifiedAt?: number | null;
}

export class DepartmentRequest {
  constructor(
    public keyword?: string,
    public pageIndex?: number,
    public pageSize?: number,
    public hasPageable?: boolean,
    public sortBy?: string,
    public startAt?: number,
    public endAt?: number,
    public createdBy?: Array<string>,
    public status?: string,
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
    this.startAt = startAt;
    this.endAt = endAt;
    this.createdBy = createdBy;
    this.status = status;
    this.startCreatedAt = startCreatedAt;
    this.endCreatedAt = endCreatedAt;
    this.startLastModifiedAt = startLastModifiedAt;
    this.endLastModifiedAt = endLastModifiedAt;
  }
}
