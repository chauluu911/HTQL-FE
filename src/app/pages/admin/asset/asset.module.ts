import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AssetComponent } from './asset-list/asset.component';
import { AssetRoutingModule } from './asset-routing.module';
import { AssetTypeComponent } from './asset-type/asset-type.component';
import { UpdateAssetTypeComponent } from './update-asset-type/update-asset-type.component';
import { UpdateAssetComponent } from './update-asset/update-asset.component';

@NgModule({
  declarations: [
    AssetComponent,
    AssetTypeComponent,
    UpdateAssetComponent,
    UpdateAssetTypeComponent,
  ],
  imports: [CommonModule, SharedModule, AssetRoutingModule],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AssetModule {}
