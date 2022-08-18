import { HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBaseResponse } from '@shared/models/base.model';
import CommonUtil from '@shared/utils/common-utils';
import { Observable, of } from 'rxjs';
import { EntityResponseType } from '../common/abstract.service';

@Injectable({
  providedIn: 'root'
})
export class MockService {

  constructor() { }


  sortAndPaginateItems<T>(params: { pageIndex?: number, pageSize?: number, sortBy?: string}, entities: T[]):
    Observable<EntityResponseType<T[]>> {
    const { sortBy } = params;
    let sortedAndPagniatedEntities = [...entities];

    const [ sortField, sortOrder ] = (sortBy || '').split('.') as string[];

    // sort
    // if (sortField && sortOrder) {
    //   sortedAndPagniatedEntities = sortedAndPagniatedEntities.sort((a: any, b: any) => {
    //     if (a[sortField] > b[sortField]) {
    //       return sortOrder === SORT.ASC ? 1 : -1;
    //     } else if ( a[sortField] === b[sortField]) {
    //       return 0;
    //     } else {
    //       return sortOrder === SORT.ASC ? -1 : 1;
    //     }
    //   });
    // };
    sortedAndPagniatedEntities = CommonUtil.sort(sortedAndPagniatedEntities, sortOrder as 'asc' | 'desc', sortField);

    // paginate
    const { pageIndex, pageSize } = params;
    if (pageIndex && pageSize) {
      const startIndex = (pageIndex - 1) * pageSize;
      const endIndex = startIndex + (pageSize - 1);
      sortedAndPagniatedEntities = sortedAndPagniatedEntities.slice(startIndex, endIndex + 1);
    }

    const responseWrapper: EntityResponseType<any> = {
      body: {
        success: true,
        code: 200,
        data: sortedAndPagniatedEntities,
        message: 'Fetch entities',
        // page?: IPageable;
        // timestamp?: string | number | any;
      },
      type: HttpEventType.Response,
      clone(): HttpResponse<IBaseResponse<T[]>> {
        throw new Error('Function not implemented.');
      },
      headers: new HttpHeaders(),
      status: 200,
      statusText: 'OK',
      url: '/entities',
      ok: true
    };
    return of(responseWrapper);
  }
}
