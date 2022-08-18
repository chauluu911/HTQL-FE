export interface IEmployeeRequest {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
  hasPageable?: boolean;
  sortBy?: string;
  status?: string;
  departmentIds?: string [];
  accountType?: string;

}

export class EmployeeRequest {
  constructor(
    public keyword?: string,
    public pageIndex?: number,
    public pageSize?: number,
    public hasPageable?: boolean,
    public sortBy?: string,
    public status?: string,
    public departmentIds?: string[],
    public accountType?: string,
  ) {
    this.keyword = keyword;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.hasPageable = hasPageable;
    //   this.ids = ids;
    this.sortBy = sortBy;
    this.status = status;
    this.departmentIds = departmentIds;
    this.accountType = accountType;
  }
}
