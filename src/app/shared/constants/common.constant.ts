import { TransferDirection } from 'ng-zorro-antd/transfer';

export const SEARCH_TIME_WAIT = 400; // (ms)

export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
};

export const MAX_NUMBER_VALUE = Number.MAX_VALUE;

export const MAX_LENGTH_EDITOR = 2000;

export const STATUS_ACTIVE = 'ACTIVE';
export const STATUS_INACTIVE = 'INACTIVE';

export const MAX_HOUR_IN_DAY = 24;
export const MAX_MINUTE_IN_HOUR = 60;
export const MIN_DAY_IN_MONTH = 1;
export const MAX_DAY_IN_MONTH = 31;
export const DEFAULT_TIME_FORMAT = 'HH:mm';
export const DEFAULT_DATE_FORMAT = 'DD/MM/yyyy';

export const BOOLEAN_STRING = {
  TRUE: 'true',
  FALSE: 'false',
};

export const METHODS = [
  {
    label: 'POST',
    value: 'POST',
  },
  {
    label: 'GET',
    value: 'GET',
  },
  {
    label: 'PUT',
    value: 'PUT',
  },
  {
    label: 'DELETE',
    value: 'DELETE',
  },
];

export const MODULES = [
  {
    label: 'IAM',
    value: 'iam',
  },
  {
    label: 'SYSTEM',
    value: 'system',
  },
  {
    label: 'NOTIFICATION',
    value: 'notification',
  },
  {
    label: 'TICKET',
    value: 'ticket',
  },
  {
    label: 'SURVEY',
    value: 'survey',
  },
  {
    label: 'BUILDING',
    value: 'building',
  },
  {
    label: 'STORAGE',
    value: 'storage',
  },
];

export const HTTP_CODES = [
  {
    label: '500',
    value: 500,
  },
  {
    label: '503',
    value: 503,
  },
  {
    label: '400',
    value: 400,
  },
  {
    label: '401',
    value: 401,
  },
  {
    label: '403',
    value: 403,
  },
  {
    label: '405',
    value: 405,
  },
  {
    label: '200',
    value: 200,
  },
];

export const GENDER_MAP = {
  1: 'model.user.service.userGender.male',
  0: 'model.user.service.userGender.female',
  2: 'model.user.service.userGender.other',
};

export const LIMIT_LENGTH_WORD_DEFAULT = 20;
const LEFT: TransferDirection = 'left';
const RIGHT: TransferDirection = 'right';

export const NZ_TRANSFER_CONST = {
  LEFT,
  RIGHT,
}

export const PRODUCT_TYPE_STR = {
  LUNCH: 'LUNCH',
  FOOD: 'FOOD',
  STATIONERY: 'STATIONERY',
  OTHER: 'OTHER',
}

export const PRODUCT_SUBTYPE_STR = {
  SALTY_FOOD: 'SALTY_FOOD',
  BLAND_FOOD: 'BLAND_FOOD',
}

export const PRODUCT_TYPE_STR_MAP: {
  [key: string]: string;
} = {
  LUNCH: 'model.product.lunch',
  FOOD: 'model.product.dessert',
  STATIONERY: 'model.product.stationery',
  OTHER: 'model.product.other',
}

export const PRODUCT_SUBTYPE_STR_MAP: {
  [key: string]: string;
} = {
  SALTY_FOOD: 'model.product.salty',
  BLAND_FOOD: 'model.product.bland',
}

export const PRODUCT_TYPE: { label: string; value: string; }[] = [
  {
    label: 'model.product.lunch',
    value: PRODUCT_TYPE_STR.LUNCH,
  },
  {
    label: 'model.product.food',
    value: PRODUCT_TYPE_STR.FOOD,
  },
  {
    label: 'model.product.stationery',
    value: PRODUCT_TYPE_STR.STATIONERY,
  },
  {
    label: 'model.product.other',
    value: PRODUCT_TYPE_STR.OTHER,
  }
];

export const PRODUCT_SUBTYPE: { label: string; value: string; }[] = [
  {
    label: 'model.product.meat',
    value: PRODUCT_SUBTYPE_STR.SALTY_FOOD,
  },
  {
    label: 'model.product.vegetable',
    value: PRODUCT_SUBTYPE_STR.BLAND_FOOD,
  }
];

export const MENU_TYPE_STR = {
  MENU_LUNCH: 'BUFFET',
  MENU_FOOD: 'SET',
}

export const MENU_TYPE_STR_MAP: {
  [key: string]: string;
} = {
  BUFFET: 'model.product.lunch',
  SET: 'model.product.dessert'
}

export const MENU_PUBLISH_STR = {
  MENU_PUBLISH: 'TRUE',
  MENU_UNPUBLISH: 'FALSE',
}

export const ORDER_STATUS_STR: {
  [key: string]: string;
} = {
  NEW: 'model.order.status.new',
  ORDER: 'model.order.status.order',
  DELIVERED: 'model.order.status.delivered',
  PAID: 'model.order.status.paid',
}

export const ORDER_STATUS_CONST: {
  [key: string]: string;
} = {
  NEW: 'NEW',
  ORDER: 'ORDER',
  DELIVERED: 'DELIVERED',
  PAID: 'PAID',
}

export const ORDER_STATUS: { label: string; value: string; }[] = [
  {
    label: 'model.order.status.new',
    value: 'NEW',
  },
  {
    label: 'model.order.status.order',
    value: 'ORDER',
  },
  {
    label: 'model.order.status.delivered',
    value: 'DELIVERED',
  },
  {
    label: 'model.order.status.paid',
    value: 'PAID',
  },
];


export const ORDER_TYPE_CONST: {
  [key: string]: string;
} = {
  ORDER_SET: 'ORDER_SET',
  ORDER_BUFFET: 'ORDER_BUFFET',
}


export const ORDER_TYPE_STR: {
  [key: string]: string;
} = {
  ORDER_SET: 'model.order.type.orderSet',
  ORDER_BUFFET: 'model.order.type.orderBuffet',
}

export const ORDER_TYPE: { label: string; value: string; }[] = [
  {
    label: 'model.order.type.orderSet',
    value: 'ORDER_SET',
  },
  {
    label: 'model.order.type.orderBuffet',
    value: 'ORDER_BUFFET',
  },
]

export const MENU_TYPE: { label: string; value: string; }[] = [
  {
    label: 'model.menu.lunch',
    value: MENU_TYPE_STR.MENU_LUNCH,
  },
  {
    label: 'model.menu.food',
    value: MENU_TYPE_STR.MENU_FOOD,
  }
];

export const MENU_PUBLISH_STATUS: { label: string; value: string; }[] = [
  {
    label: 'model.menu.publishStatus',
    value: MENU_PUBLISH_STR.MENU_PUBLISH,
  },
  {
    label: 'model.menu.unPublishStatus',
    value: MENU_PUBLISH_STR.MENU_UNPUBLISH,
  }
];

export const SORT = {
  ASCEND: 'ascend',
  ASC: 'asc',
  DESC: 'desc',
};
