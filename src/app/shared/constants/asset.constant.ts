export const ASSET_NEW = 'NEW';
export const ASSET_LABELED = 'LABELED';
export const ASSET_USED = 'USED';
export const ASSET_NOT_USED = 'NOT_USED';
export const ASSET_MAINTAIN = 'MAINTAIN';
export const ASSET_DESTROY = 'DESTROY';
export const ASSET_LIQUIDATE = 'LIQUIDATE';
export const ASSET_TYPE_ACTIVE = 'ACTIVE';
export const ASSET_TYPE_INACTIVE = 'INACTIVE';

export const ASSET_STATUS = [
  { value: ASSET_NEW, label: 'model.asset.new' },
  { value: ASSET_LABELED, label: 'model.asset.labeled' },
  { value: ASSET_USED, label: 'model.asset.used' },
  { value: ASSET_MAINTAIN, label: 'model.asset.maintain' },
  { value: ASSET_DESTROY, label: 'model.asset.destroy' },
  { value: ASSET_LIQUIDATE, label: 'model.asset.liquidate' },
  { value: ASSET_NOT_USED, label: 'model.asset.notUsed' },
];
export const ASSET_TYPE_STATUS = [
  { value: ASSET_TYPE_ACTIVE, label: 'model.asset.type.active' },
  { value: ASSET_TYPE_INACTIVE, label: 'model.asset.type.inactive' },
];
