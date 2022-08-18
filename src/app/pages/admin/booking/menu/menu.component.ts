import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UploadComponent } from '@shared/components/upload/upload.component';
import { MENU_PUBLISH_STATUS, MENU_TYPE } from '@shared/constants/common.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { IMenuResponse, MenuResponse } from '@shared/models/booking/menu.model';
import { IMenuSearchRequest, MenuSearchRequest } from '@shared/models/request/menu-search-request.model';
import { FoodMenuService } from '@shared/services/booking/menu.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { ROUTER_ACTIONS, ROUTER_UTILS } from '@shared/utils/router.utils';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BookingCommonUtil } from '../common-booking/booking.constant';
import { SearchMenuComponent } from '../search-menu/search-menu.component';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  menuSearchRequest: MenuSearchRequest = {
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
  };
  menus: IMenuResponse[] = [];
  selectedMenu: IMenuResponse = new MenuResponse();
  total = 0;
  formSearchMenu: FormGroup = new FormGroup({});
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  types = MENU_TYPE;
  publishStatus = MENU_PUBLISH_STATUS;

  publishPopup = {
    title: '',
    content: '',
    okText: '',
    interpolateParams: {},
  };
  action: any;
  isPubUnpubPopupVisible = false;
  unpublish = false;

  isDeletePopupVisible = false;
  ROUTER_ACTIONS = ROUTER_ACTIONS;
  isFirstFetch = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translateService: TranslateService,
    private toast: ToastService,
    private modalService: NzModalService,
    private foodMenuService: FoodMenuService,
  ) {
    this.initForm();
   }

  ngOnInit(): void {
    this.loadData();
  }

  search(): void {
    this.menuSearchRequest.type = this.formSearchMenu.get('type')?.value;
    this.menuSearchRequest.published = this.formSearchMenu.get('published')?.value;
    this.menuSearchRequest.keyword = this.formSearchMenu.get('keyword')?.value;
    this.loadData();
  }

  initForm(): void {
    this.formSearchMenu = this.fb.group({
      title: [this.menuSearchRequest.title || null],
      type: [this.menuSearchRequest.type || null],
      published: [this.menuSearchRequest.published || null],
      startClosedAt: [ null],
      endClosedAt: [this.menuSearchRequest.endClosedAt || null],
      keyword: [this.menuSearchRequest.keyword || null],
    })
  }

  onChangeCreatedDate(rangeDate: { fromDate?: Date; toDate?: Date }): void {
    this.menuSearchRequest.startClosedAt = rangeDate.fromDate?.valueOf();
    this.menuSearchRequest.endClosedAt = rangeDate.toDate?.valueOf();
    this.formSearchMenu.get('startClosedAt')?.setValue(rangeDate.fromDate);
    this.formSearchMenu.get('endClosedAt')?.setValue(rangeDate.toDate);
  }

  import(): void {
    const base = CommonUtil.modalBase(UploadComponent, {
      multiple: true,
      acceptTypeFiles: ['excel'],
    });
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.menuSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.loadData();
      }
    });
  }

  loadData(): void {
    this.foodMenuService.search(this.menuSearchRequest).subscribe(
      (response: any) => {
        const data = response?.body?.data;
        this.menus = data.map((menu: IMenuResponse) => this.enrichCloseStatus(menu))
        this.total = response.body.page.total;
      }
    );
  }

  getLimitLength(text: string): string {
    return CommonUtil.getLimitLength(text, 20);
  }

  detail(id: string): void {
    this.router.navigate([ROUTER_UTILS.booking.root, ROUTER_UTILS.booking.menu, id, ROUTER_ACTIONS.detail]);
  }

  create(): void {
    this.router.navigate([ROUTER_UTILS.booking.root, ROUTER_UTILS.booking.menu, ROUTER_ACTIONS.create]);
  }

  update(id: string): void {
    this.router.navigate([ROUTER_UTILS.booking.root, ROUTER_UTILS.booking.menu, id, ROUTER_ACTIONS.update]);
  }

  onUpdateProduct(result: { success: boolean }): void {

  }

  updatePublishStatus($event: any) {
  }

  delete(menu: IMenuResponse): void {
    const deleteForm = CommonUtil.modalConfirm(
      this.translateService,
      'model.menu.delete',
      'model.menu.deleteConfirm',
      { title: menu?.title }
    );

    const modal: NzModalRef = this.modalService.create(deleteForm);

    modal.afterClose.subscribe((result: {success: boolean}) => {
      if (result?.success) {
        this.foodMenuService.delete(menu.id || '').subscribe((response: any) => {
          this.toast.success('model.menu.success.delete');
          this.loadData();
        })
      }
    })
  };

  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.menuSearchRequest.pageIndex, this.menuSearchRequest.pageSize);
  }

  openPublishPopup(menu: IMenuResponse): void {
    // modalBase type

    // const form = CommonUtil.modalConfirm(
    //   this.translateService,
    //   'model.menu.publish',
    //   'model.menu.publishConfirm',
    //   { title: menu.title }
    // );
    // // const confirmType =  'confirm' | 'info' | 'success' | 'error' | 'warning';
    // const confirmType =  'confirm';
    // const modal: NzModalRef = this.modalService.confirm(form, confirmType);
    // modal.afterClose.subscribe((result: {success: boolean}) => {
    //   if (result?.success) {
    //     this.foodMenuService.publish(menu.id || '').subscribe(
    //       (response: any) => {
    //         this.menuSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
    //         this.toast.success('model.menu.success.publish');
    //         this.loadData();
    //       },
    //     );
    //   }
    // });

    this.unpublish = false;
    this.selectedMenu = menu;
    this.publishPopup = {

      title: 'model.menu.publish',
      content: 'model.menu.publishConfirm',
      interpolateParams: { title: `<b>${menu?.title || ''}</b>` },
      okText: 'action.confirm',
    }
    this.isPubUnpubPopupVisible = true;
  }

  openUnpublishPopup(menu: IMenuResponse): void {
   // modalBase type

    // const form = CommonUtil.modalConfirm(
    //   this.translateService,
    //   'model.menu.unpublish',
    //   'model.menu.unpublishConfirm',
    //   { title: menu.title }
    // );
    // const modal: NzModalRef = this.modalService.confirm(form);
    // modal.afterClose.subscribe((result: {success: boolean}) => {
    //   if (result?.success) {
    //     this.foodMenuService.unpublish(menu.id || '').subscribe(
    //       (response: any) => {
    //         this.menuSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
    //         this.toast.success('model.menu.success.unpublish');
    //         this.loadData();
    //       },
    //     );
    //   }
    // });

    this.unpublish = true;
    this.selectedMenu = menu;
    this.publishPopup = {
      title: 'model.menu.unpublish',
      content: 'model.menu.unpublishConfirm',
      interpolateParams: { title: `<b>${menu?.title || ''}</b>` },
      okText: 'action.confirm',
    }
    this.isPubUnpubPopupVisible = true;
  }

  onPubUnpubModalClosed(result: { success: boolean}): void {
    if (result.success) {
      if (this.unpublish) {
        this.foodMenuService.unpublish(this.selectedMenu.id || '').subscribe(
          (response: any) => {
            this.menuSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
            this.toast.success('model.menu.success.unpublish');
            this.loadData();
          },
        );
      } else {
        this.foodMenuService.publish(this.selectedMenu.id || '').subscribe(
          (response: any) => {
            this.menuSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
            this.toast.success('model.menu.success.publish');
            this.loadData();
          },
        );
      }

    }
    this.isPubUnpubPopupVisible = false;
  }

  private enrichCloseStatus(menu: IMenuResponse) {
    const { closedAt } = menu;
    const isClosed = moment(closedAt).isBefore(new Date());
    return { isClosed, ...menu };
  }

  pipeType(type: string): string {
    return BookingCommonUtil.pipeMenuType(type);
  }

  openAdvancedSearch(): void {
    const base = CommonUtil.modalBase(SearchMenuComponent, {

    }, '40%');

    const modal: NzModalRef = this.modalService.create(base);

    modal.afterClose.subscribe((result: { success: boolean, data: IMenuSearchRequest }) => {
      if (result?.success) {
        this.menuSearchRequest.pageIndex = result.data.pageIndex;
        this.menuSearchRequest.pageSize = result.data.pageSize;
        this.menuSearchRequest.sortBy = result.data.sortBy;
        this.menuSearchRequest.published = result.data.published;
        this.menuSearchRequest.title = result.data.title;
        this.menuSearchRequest.type = result.data.type;
        this.menuSearchRequest.startClosedAt = result.data.startClosedAt;
        this.menuSearchRequest.endClosedAt = result.data.endClosedAt;
        this.loadData();
      } else {

      }
    })

  }

  resetSearch(): void{
    this.formSearchMenu.reset();
    this.menuSearchRequest = {
      pageIndex: PAGINATION.PAGE_DEFAULT,
      pageSize: PAGINATION.SIZE_DEFAULT,
    }
    this.search();
  }

  onQuerySearch(params: { pageIndex: number; pageSize: number }): void {
    const { pageIndex, pageSize } = params;
    this.menuSearchRequest.pageIndex = pageIndex;
    this.menuSearchRequest.pageSize = pageSize;
    this.loadData();
  }

  onChangeQueryParams(params: NzTableQueryParams): void {
    if (this.isFirstFetch) {
      this.isFirstFetch = false;
      return;
    }

    const sortBy = CommonUtil.getSortStringFromParamObject(params);
    this.menuSearchRequest.sortBy = sortBy;

    this.loadData();
  }

}
