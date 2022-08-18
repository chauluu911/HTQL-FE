import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ORDER_STATUS, ORDER_TYPE } from '@shared/constants/common.constant';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { IORderSearchRequest, OrderSearchRequest } from '@shared/models/request/order-search-request.model';
import { ROUTER_ACTIONS } from '@shared/utils/router.utils';

@Component({
  selector: 'app-search-order',
  templateUrl: './search-order.component.html',
  styleUrls: ['./search-order.component.scss']
})
export class SearchOrderComponent implements OnInit {

  formSearchOrder: FormGroup = new FormGroup({});
  orderSearchRequest: IORderSearchRequest = new OrderSearchRequest();
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;

  types = ORDER_TYPE;
  status = ORDER_STATUS;

  ROUTER_ACTIONS = ROUTER_ACTIONS;
  action = '';

  constructor() { }

  ngOnInit() {
  }

}
