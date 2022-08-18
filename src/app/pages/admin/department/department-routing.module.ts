import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guard';
import { ROUTER_UTILS } from '@shared/utils/router.utils';
import { DepartmentComponent } from '../department/department.component';
import { DetailDepartmentComponent } from './detail-department/detail-department.component';

const routes: Routes = [
  {
    path: '',
    component: DepartmentComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['department:view'],
      title: 'model.department.title',
    },
  },
  {
    path: ROUTER_UTILS.department.detail,
    component: DetailDepartmentComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['department:view'],
      title: 'model.department.info',
    },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentRoutingModule {}
