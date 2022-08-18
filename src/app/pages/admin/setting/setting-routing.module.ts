import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guard/auth.guard';
import { ClientComponent } from '@pages/admin/setting/client/client.component';
import { ROUTER_UTILS } from '@shared/utils/router.utils';
import { ActionLogDetailComponent } from './action-log/action-log-detail/action-log-detail.component';
import { ActionLogComponent } from './action-log/action-log.component';
import { ConfigurationListComponent } from './configuration-list/configuration-list.component';
import { GroupUserDetailComponent } from './group-user/group-user-detail/group-user-detail.component';
import { GroupUserComponent } from './group-user/group-user.component';
import { RoleComponent } from './role/role.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: ROUTER_UTILS.setting.user,
    component: UserComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['user:view'],
      title: 'model.user.title',
    },
  },
  {
    path: ROUTER_UTILS.setting.userCreate,
    component: UpdateUserComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['user:create'],
      title: 'model.user.title',
    },
  },
  {
    path: ROUTER_UTILS.setting.userUpdate,
    component: UpdateUserComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['user:update'],
      title: 'model.user.title',
    },
  },
  {
    path: ROUTER_UTILS.setting.groupUser,
    component: GroupUserComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['user:view'],
      title: 'model.groupUser.title',
    },
  },
  {
    path: ROUTER_UTILS.setting.groupUserDetail,
    component: GroupUserDetailComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['group:view'],
      title: 'model.groupUser.title',
    },
  },
  {
    path: ROUTER_UTILS.setting.myProfile,
    component: UpdateUserComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['user:update'],
      title: 'model.user.title',
    },
  },
  {
    path: ROUTER_UTILS.setting.role,
    component: RoleComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['role:view'],
      title: 'model.role.title',
    },
  },
  {
    path: ROUTER_UTILS.setting.actionLog,
    component: ActionLogComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['action_log:view'],
      title: 'model.action-log.title',
    },
  },
  {
    path: ROUTER_UTILS.setting.actionLogDetail,
    component: ActionLogDetailComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['action_log:view'],
      title: 'model.action-log.detail.title',
    },
  },
  {
    path: ROUTER_UTILS.setting.configuration.list,
    component: ConfigurationListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['configuration:view'],
      title: 'model.configuration.title',
    },
  },
  {
    path: ROUTER_UTILS.setting.client,
    component: ClientComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['client:view'],
      title: 'model.client.title',
    },
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule {}
