export const ORGANIZATION_ACTIVE = 'ACTIVE';
export const ORGANIZATION_INACTIVE = 'INACTIVE';
export const INTERNAL_CUSTOMER = 'INTERNAL_CUSTOMER';
export const EXTERNAL_CUSTOMER = 'EXTERNAL_CUSTOMER';
export const ORGANIZATION_STATUS = [
  { value: ORGANIZATION_ACTIVE, label: 'model.organization.active' }, // Trạng thái hoạt động
  { value: ORGANIZATION_INACTIVE, label: 'model.organization.inactive' }, // Trạng thái không hoạt động
];
export const ORGANIZATION_TYPE_STATUS = [
  { value: INTERNAL_CUSTOMER, label: 'model.organization.internal_customer' },
  { value: EXTERNAL_CUSTOMER, label: 'model.organization.external_customer' },
];
