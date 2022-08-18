import { MENU_TYPE_STR_MAP, ORDER_STATUS_CONST, ORDER_STATUS_STR, ORDER_TYPE_STR, PRODUCT_SUBTYPE_STR_MAP, PRODUCT_TYPE_STR_MAP } from '@shared/constants/common.constant';

export class BookingCommonUtil {
  static pipeProductType(type: string): string {
    return PRODUCT_TYPE_STR_MAP[type];
  }

  static pipeProductSubtype(type: string): string {
    return PRODUCT_SUBTYPE_STR_MAP[type];
  }

  static pipeMenuType(type: string): string {
    return MENU_TYPE_STR_MAP[type];
  }

  static pipeOrderType(orderTypeCode: string) {
    return ORDER_TYPE_STR[orderTypeCode];
  }

  static pipeOrderStatus(orderStatusCode: string) {
    return ORDER_STATUS_STR[orderStatusCode];
  }

  static formatStatusColor(status: string): string {
    if (status === ORDER_STATUS_CONST.ORDER) {
      return 'badge-info';
    } else if (status === ORDER_STATUS_CONST.DELIVERED) {
      // return 'badge-primary';
      return '';
    } else if (status === ORDER_STATUS_CONST.PAID) {
      return 'badge-success';
    } else if (status === ORDER_STATUS_CONST.NEW) {
      return 'badge-new';
    } else {
      // return 'badge-light';
      return '';
    }
  }

}

export const DEFAULT_QUANTITY = 1;

export const FOOD_PLACEHOLDER_FILE = `assets/images/icon/fast-food.png`;
export const AVATAR_PLACEHOLDER_FILE = `assets/images/icon/avatar.png`;

export const SVG_FILE_EXTENSION = 'svg';
