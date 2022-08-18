import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';
import { OrganizationComponent } from '../organization/organization.component';
import { OrganizationRoutingModule } from './organization-routing.module';
import { UpdateOrganizationComponent } from './update-organization/update-organization.component';

@NgModule({
  declarations: [OrganizationComponent, UpdateOrganizationComponent],
  imports: [
    CommonModule,
    SharedModule,
    QRCodeModule,
    OrganizationRoutingModule,
  ],
  providers: [],
})
export class OrganizationModule {}
