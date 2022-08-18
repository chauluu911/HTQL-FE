import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTER_ACTIONS, ROUTER_UTILS } from '@shared/utils/router.utils';
import { DetailMenuComponent } from './detail-menu/detail-menu.component';
import { DetailOrderComponent } from './detail-order/detail-order.component';
import { MenuComponent } from './menu/menu.component';
import { OrderComponent } from './order/order.component';
import { ProductComponent } from './product/product.component';
import { UpdateMenuComponent } from './update-menu/update-menu.component';
import { UpdateOrderComponent } from './update-order/update-order.component';

const routes: Routes = [
  {
    path: ROUTER_UTILS.booking.product,
    component: ProductComponent,
    data: {
      title: 'model.product.list',
    }
  },
  {
    path: ROUTER_UTILS.booking.menu,
    component: MenuComponent,
    data: {
      title: 'model.menu.list',
    }
  },
  {
    path: ROUTER_UTILS.booking.menuCreate,
    component: UpdateMenuComponent,
    data: {
      title: 'model.menu.create',
      action: ROUTER_ACTIONS.create,
    }
  },
  {
    path: ROUTER_UTILS.booking.menuUpdate,
    component: UpdateMenuComponent,
    data: {
      title: 'model.menu.update',
      action: ROUTER_ACTIONS.update,
    }
  },
  {
    path: ROUTER_UTILS.booking.menuDetail,
    component: DetailMenuComponent,
    data: {
      title: 'model.menu.detail',
      action: ROUTER_ACTIONS.detail,
    }
  },
  {
    path: ROUTER_UTILS.booking.order,
    component: OrderComponent,
    data: {
      title: 'model.order.list',
    }
  },
  {
    path: ROUTER_UTILS.booking.orderCreate,
    component: UpdateOrderComponent,
    data: {
      title: 'model.order.create',
      action: ROUTER_ACTIONS.create,
    }
  },
  {
    path: ROUTER_UTILS.booking.orderUpdate,
    component: UpdateOrderComponent,
    data: {
      title: 'model.order.update',
      action: ROUTER_ACTIONS.update,
    }
  },
  {
    path: ROUTER_UTILS.booking.orderDetail,
    component: DetailOrderComponent,
    data: {
      title: 'model.order.detail',
      action: ROUTER_ACTIONS.detail,
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
