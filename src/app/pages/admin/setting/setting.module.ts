import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { ActionLogDetailComponent } from './action-log/action-log-detail/action-log-detail.component';
import { ActionLogComponent } from './action-log/action-log.component';
import { ClientUpdateComponent } from './client/client-update/client-update.component';
import { ClientComponent } from './client/client.component';
import { ConfigurationListComponent } from './configuration-list/configuration-list.component';
import { ConfigurationUpdateComponent } from './configuration-list/configuration-update/configuration-update.component';
import { GroupUserDetailComponent } from './group-user/group-user-detail/group-user-detail.component';
import { GroupUserComponent } from './group-user/group-user.component';
import { UpdateGroupUserComponent } from './group-user/update-group-user/update-group-user.component';
import { RoleComponent } from './role/role.component';
import { UpdatePermissionComponent } from './role/update-permission/update-permission.component';
import { UpdateRoleComponent } from './role/update-role/update-role.component';
import { SettingRoutingModule } from './setting-routing.module';
import { AdvancedSearchUserComponent } from './user/advanced-search-user/advanced-search-user.component';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { UserComponent } from './user/user.component';
@NgModule({
  declarations: [
    UserComponent,
    UpdateUserComponent,
    RoleComponent,
    UpdateRoleComponent,
    UpdatePermissionComponent,
    ChangePasswordComponent,
    AdvancedSearchUserComponent,
    ActionLogComponent,
    ActionLogDetailComponent,
    ConfigurationListComponent,
    ConfigurationUpdateComponent,
    ClientComponent,
    ClientUpdateComponent,
    GroupUserComponent,
    UpdateGroupUserComponent,
    GroupUserDetailComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SettingRoutingModule,
    NzAlertModule,
    NzAvatarModule,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SettingModule {}
