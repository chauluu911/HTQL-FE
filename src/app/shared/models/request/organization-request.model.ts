export interface IOrganizationRequest {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
  hasPageable?: boolean;
  sortBy?: string;
  status?: string;
  incorporationDate?: number | string | null;
  incorporationDateStartAt?: number | string | null;
  incorporationDateEndAt?: number | string | null;
}

export class OrganizationRequest {
  constructor(
    public keyword?: string,
    public pageIndex?: number,
    public pageSize?: number,
    public hasPageable?: boolean,
    public sortBy?: string,
    public status?: string,
    public incorporationDate?: number | string | null,
    public incorporationDateStartAt?: number | string | null,
    public incorporationDateEndAt?: number | string | null
  ) {
    this.keyword = keyword;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.hasPageable = hasPageable;
    this.sortBy = sortBy;
    this.status = status;
    this.incorporationDate = incorporationDate;
    this.incorporationDateStartAt = incorporationDateStartAt;
    this.incorporationDateEndAt = incorporationDateEndAt;
  }
}
