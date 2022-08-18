export interface IGroupUserRequest {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
}
export class GroupUserRequest implements IGroupUserRequest {
  constructor(
    public keyword?: string,
    public pageIndex?: number,
    public pageSize?: number,
    public sortBy?: string
  ) {
    this.keyword = keyword;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.sortBy = sortBy;
  }
}
