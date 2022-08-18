import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MENU_TYPE } from '@shared/constants/common.constant';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { IMenuSearchRequest, MenuSearchRequest } from '@shared/models/request/menu-search-request.model';
import { ROUTER_ACTIONS } from '@shared/utils/router.utils';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-search-menu',
  templateUrl: './search-menu.component.html',
  styleUrls: ['./search-menu.component.scss']
})
export class SearchMenuComponent implements OnInit {

  formMenuSearch: FormGroup = new FormGroup({});
  menuSearchRequest: IMenuSearchRequest = new MenuSearchRequest();
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;

  types = MENU_TYPE;

  ROUTER_ACTIONS = ROUTER_ACTIONS;
  action = '';

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
  ) {
    this.menuSearchRequest =
      this.modalRef?.getConfig()?.nzComponentParams?.menuSearchRequest || {};
    this.initForm();
  }

  ngOnInit(): void {
  }

  initForm(): void {
    this.formMenuSearch = this.fb.group({
      title: [this.menuSearchRequest.title || null],
      type: [this.menuSearchRequest.type || null],
      published: [this.menuSearchRequest.published || null],
      startCloseAt: [this.menuSearchRequest.startClosedAt || null],
      endCloseAt: [this.menuSearchRequest.endClosedAt || null]
    });
  }

  onSubmit(): void {
    this.modalRef.close({
      data: this.formMenuSearch.value,
      success: !this.formMenuSearch.invalid,
    })
  }

  onCancel(): void {
    this.formMenuSearch.get('title')?.setValue('');
    this.formMenuSearch.get('type')?.setValue('');
    this.formMenuSearch.get('published')?.setValue(false);
    this.formMenuSearch.get('startClosedAt')?.setValue('');
    this.formMenuSearch.get('endClosedAt')?.setValue('');
  }

}
