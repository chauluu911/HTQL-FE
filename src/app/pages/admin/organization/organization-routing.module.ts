import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guard';
import { OrganizationComponent } from '../organization/organization.component';
const routes: Routes = [
  {
    path: '',
    component: OrganizationComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['organization:view'],
      title: 'model.organization.title',
    },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationRoutingModule {}
