export interface IUserRequest {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
  hasPageable?: boolean;
  ids?: string[];
  sortBy?: string;
  status?: string;
  accountType?: string;
  departmentIds?: string;
  roleIds?: string;
  groupIds?: string[];
  searchByGroup?: boolean;
}

export class UserRequest {
  constructor(
    public keyword?: string,
    public pageIndex?: number,
    public pageSize?: number,
    public hasPageable?: boolean,
    public ids?: string[],
    public sortBy?: string,
    public status?: string,
    public accountType?: string,
    public departmentIds?: string,
    public roleIds?: string,
    public groupIds?: string[],
    public searchByGroup?: boolean
  ) {
    this.keyword = keyword;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.hasPageable = hasPageable;
    this.ids = ids;
    this.sortBy = sortBy;
    this.status = status;
    this.accountType = accountType;
    this.departmentIds = departmentIds;
    this.roleIds = roleIds;
    this.groupIds = groupIds;
    this.searchByGroup = searchByGroup;
  }
}
