export const STATUS = {
  SUCCESS_200: 200,
  ERROR_400: 400,
  ERROR_401: 401,
  ERROR_403: 403,
  ERROR_404: 404,
};

export const STATUS_ACTIVE = 'ACTIVE';
export const STATUS_INACTIVE = 'INACTIVE';

export const ENTITY_STATUS_CONST = {
  ACTIVE: {
    label: 'common.active',
    code: STATUS_ACTIVE,
    value: 1,
  },
  INACTIVE: {
    label: 'common.inactive',
    code: STATUS_INACTIVE,
    value: 0,
  },
};

// convert to array
export const ENTITY_STATUS = Object.values(ENTITY_STATUS_CONST);

// map data list
export const ENTITY_STATUS_MAP = ENTITY_STATUS.reduce(
  (data, valueMap) => ({ ...data, [valueMap.code]: valueMap.label }),
  {}
) as any;
