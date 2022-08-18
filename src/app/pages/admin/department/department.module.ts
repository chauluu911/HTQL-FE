import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { AdvancedSearchDepartmentComponent } from '../department/advanced-search-department/advanced-search-department.component';
import { DepartmentComponent } from '../department/department.component';
import { DepartmentRoutingModule } from './department-routing.module';
import { DetailDepartmentComponent } from './detail-department/detail-department.component';
import { UpdateDepartmentComponent } from './update-department/update-department.component';
@NgModule({
  declarations: [
    DepartmentComponent,
    AdvancedSearchDepartmentComponent,
    DetailDepartmentComponent,
    UpdateDepartmentComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DepartmentRoutingModule,
    NzAvatarModule,
    NzDatePickerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DepartmentModule {}
