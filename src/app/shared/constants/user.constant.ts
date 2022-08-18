export const USER_ACTIVE = 'ACTIVE';
export const USER_INACTIVE = 'INACTIVE';
export const USER_EMPLOYEE = 'EMPLOYEE';
export const USER_CUSTOMER = 'CUSTOMER';

export const USER_STATUS = [
  {value: USER_ACTIVE, label: 'model.user.service.userStatus.active'}, // Trạng thái hoạt động
  {value: USER_INACTIVE, label: 'model.user.service.userStatus.inactive'}, // Trạng thái không hoạt động
];


export const USER_GENDER = [
  {value: 'MALE', label: 'model.user.service.userGender.male'},
  {value: 'FEMALE', label: 'model.user.service.userGender.female'},
  // { value: "OTHER", label:'model.user.service.userGender.other' },
];

export const ACTION_TYPE = {
  CREATE_USER: 'CREATE_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER'
};

export const USER_ACCOUNT_TYPE = [
  {value: USER_CUSTOMER, label: 'model.user.service.accountType.customer'},
  {value: USER_EMPLOYEE, label: 'model.user.service.accountType.employee'},
];


export const USER_TYPE = 'user';
export const USER_INTERNAL = 'user_internal';
export const USER_LDAP = 'user_ldap';
export const USER_PROFILE_INTERNAL = 'INTERNAL';
export const USER_PROFILE_LDAP = 'LDAP';





