import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guard';
import { ROUTER_ACTIONS, ROUTER_UTILS } from '@shared/utils/router.utils';
import { NotificationDetailMeComponent } from './notification-detail-me/notification-detail-me.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationMeComponent } from './notification-me/notification-me.component';
import { NotificationUpdateComponent } from './notification-update/notification-update.component';

const routes: Routes = [
  {
    path: ROUTER_UTILS.notification.list,
    component: NotificationListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['notification:view'],
      title: 'model.notification.title',
    },
  },
  {
    path: ROUTER_UTILS.notification.create,
    component: NotificationUpdateComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['notification:create'],
      title: 'model.notification.title',
      action: ROUTER_ACTIONS.create,
    },
  },
  {
    path: ROUTER_UTILS.notification.update,
    component: NotificationUpdateComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['notification:update'],
      title: 'model.notification.title',
      action: ROUTER_ACTIONS.update,
    },
  },
  {
    path: ROUTER_UTILS.notification.detail,
    component: NotificationDetailMeComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['notification:view'],
      title: 'model.notification.title',
      action: ROUTER_ACTIONS.detail,
    },
  },
  {
    path: ROUTER_UTILS.notification.me,
    component: NotificationMeComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['notification:view'],
      title: 'model.notification.titleMe',
      action: ROUTER_ACTIONS.view,
    },
  },
  {
    path: `${ROUTER_UTILS.notification.me}/${ROUTER_UTILS.notification.detail}`,
    component: NotificationDetailMeComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['notification:view'],
      title: 'model.notification.titleMe',
      action: ROUTER_ACTIONS.detail,
    },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationRoutingModule {}
