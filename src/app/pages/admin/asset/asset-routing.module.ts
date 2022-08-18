import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guard';
import { ROUTER_UTILS } from '@shared/utils/router.utils';
import { AssetComponent } from './asset-list/asset.component';
import { AssetTypeComponent } from './asset-type/asset-type.component';
const routes: Routes = [
  {
    path: ROUTER_UTILS.asset.list,
    component: AssetComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['asset:view'],
      title: 'model.asset.titleAsset',
    },
  },
  {
    path: ROUTER_UTILS.asset.assetType,
    component: AssetTypeComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['asset:view'],
      title: 'model.asset.titleAssetType',
    },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetRoutingModule {}
