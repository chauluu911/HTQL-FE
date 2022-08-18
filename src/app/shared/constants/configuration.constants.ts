export const CONFIGURATION_TYPE = {
  ADDRESS: {
    label: 'model.configuration.types.address',
    value: 'ADDRESS',
  },
  PHONE: {
    label: 'model.configuration.types.phone',
    value: 'PHONE_NUMBER',
  },
  DEPARTMENT: {
    label: 'model.configuration.types.department',
    value: 'DEPARTMENT',
  },
  SMS_TEMPLATE: {
    label: 'model.configuration.types.sms_template',
    value: 'SMS_TEMPLATE',
  },
  OTHER: {
    label: 'model.configuration.types.other',
    value: 'OTHER',
  },
};
export const CONFIGURATION_TYPES = [
  CONFIGURATION_TYPE.ADDRESS,
  CONFIGURATION_TYPE.PHONE,
  CONFIGURATION_TYPE.DEPARTMENT,
  // CONFIGURATION_TYPE.SMS_TEMPLATE,
  CONFIGURATION_TYPE.OTHER,
];

export const CONFIGURATION_STATUS = {
  ACTIVE: {
    label: 'model.configuration.active',
    value: 'ACTIVE',
  },
  INACTIVE: {
    label: 'model.configuration.inactive',
    value: 'INACTIVE',
  },
};
export const CONFIGURATION_STATUSES = [
  CONFIGURATION_STATUS.ACTIVE,
  CONFIGURATION_STATUS.INACTIVE,
];

export const PAGE_SIZE_INPUT_SEARCH = 20;
