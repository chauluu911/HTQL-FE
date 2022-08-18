import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ToastService } from '@shared/services/helpers/toast.service';
import { SharedModule } from '@shared/shared.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking.component';
import { DetailMenuComponent } from './detail-menu/detail-menu.component';
import { DetailOrderComponent } from './detail-order/detail-order.component';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { MenuComponent } from './menu/menu.component';
import { OrderComponent } from './order/order.component';
import { ProductComponent } from './product/product.component';
import { SearchMenuComponent } from './search-menu/search-menu.component';
import { SearchProductComponent } from './search-product/search-product.component';
import { UpdateMenuComponent } from './update-menu/update-menu.component';
import { UpdateOrderComponent } from './update-order/update-order.component';
import { UpdateProductComponent } from './update-product/update-product.component';



@NgModule({
  declarations: [
    BookingComponent,
    UpdateProductComponent,
    ProductComponent,
    MenuComponent,
    UpdateMenuComponent,
    OrderComponent,
    UpdateOrderComponent,
    SearchProductComponent,
    SearchMenuComponent,
    DetailProductComponent,
    DetailMenuComponent,
    DetailOrderComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule,
    SharedModule,
    NzTransferModule,
    NzDatePickerModule,
    NzSliderModule,
  ],
  providers: [
    ToastService,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class BookingModule { }
