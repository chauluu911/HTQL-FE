export interface IRoomRequest {
    name?: string;
    location?: string;
    code?: string;
    status?: string;
    keyword?: string;
    pageIndex?: number;
    pageSize?: number;
    hasPageable?: boolean;
    sortBy?: string;
}

export class RoomRequest implements IRoomRequest {
    constructor(
      public name?: string,
      public location?: string,
      public code?: string,
      public status?: string,
      public keyword?: string,
      public pageIndex?: number,
      public pageSize?: number,
      public hasPageable?: boolean,
      public sortBy?: string
    ) {
      this.name = name;
      this.location = location;
      this.code = code;
      this.status = status;
      this.keyword = keyword;
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
      this.hasPageable = hasPageable;
      this.sortBy = sortBy;
    }
  }
