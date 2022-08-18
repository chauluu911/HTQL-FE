import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guard';
import { ROUTER_UTILS } from '@shared/utils/router.utils';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';

const routes: Routes = [
  {
    path: ROUTER_UTILS.employee.list,
    component: EmployeeListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['employee:view'],
      title: 'model.employee.title',
    },
  },

  {
    path: ROUTER_UTILS.employee.detail,
    component: EmployeeDetailsComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['employee:view'],
      title: 'model.employee.title',
    },
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
