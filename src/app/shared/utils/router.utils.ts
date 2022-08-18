export const ROUTER_ACTIONS = {
  create: 'create',
  update: 'update',
  detail: 'detail',
  view: 'view',
  delete: 'delete',
};

export const ROUTER_UTILS = {
  base: {
    home: '',
    dashboard: 'dashboard',
    freeRoute: '**',
  },
  authentication: {
    root: 'authentication',
    login: 'login',
  },
  ticket: {
    root: 'ticket',
    create: 'create',
    createByComplaint: 'create-by-complaint/:id',
    detail: ':ticketId/detail',
  },
  survey: {
    root: 'survey',
    list: 'list',
    result: 'result',
    detailResult: 'result/:surveyId/detail/:type',
    create: 'create',
    update: ':id/update',
    detail: ':id/detail',
  },
  building: {
    root: 'building',
    list: 'list',
    detail: ':id/detail',
    create: 'create',
    unit: 'unit',
    unitCreate: 'unit/create',
    unitUpdate: 'unit/:unitId/update',
    unitDetail: 'unit/:unitId/detail',
  },
  partnerContract: {
    root: 'partner-contract',
  },
  customer: {
    root: 'customer',
    create: 'create',
    update: ':customerId/update',
  },
  notification: {
    root: 'notification',
    create: 'create/:type',
    update: ':notificationId/update/:type',
    detail: ':notificationId/detail/:type',
    me: 'me',
    list: 'list',
  },
  employee: {
    root: 'employee',
    list: 'list',
    detail: ':id',
  },

  department: {
    root: 'department',
    detail: `:id/${ROUTER_ACTIONS.detail}`,
  },

  booking: {
    root: 'booking',
    product: 'product',
    menu: 'menu',
    menuUpdate: 'menu/:id/update',
    menuCreate: 'menu/create',
    menuDetail: 'menu/:id/detail',
    order: 'order',
    orderUpdate: 'order/:id/update',
    orderDetail: 'order/:id/detail',
    orderCreate: 'order/create',
  },
  setting: {
    root: 'setting',
    user: 'user',
    userCreate: 'user/create',
    userUpdate: 'user/:id/update',
    myProfile: 'my-profile',
    groupUser: 'group-user',
    groupUserDetail: 'group-user/:id/detail',
    role: 'role',
    department: 'department',
    client: 'client',
    detail: 'department/:id/detail',
    actionLog: 'action-log',
    actionLogDetail: 'action-log/:id/detail',
    configuration: {
      root: 'parameter',
      list: 'parameter/list',
    },
  },
  meeting: {
    root: 'meeting',
    list: 'list',
    create: 'create',
    update: ':id/update',
    detail: ':id/detail',
    calender: 'me/calender',
  },
  room: {
    root: 'room',
    roomCalendar: 'room/:id/calendar',
    calendar: 'calendar',
  },
  privacyPolicy: {
    root: 'privacy-policy',
  },
  report: {
    root: 'report',
  },
  feedback: {
    public: 'feedback-public',
  },
  home: {
    root: 'home',
  },
  complaint: {
    root: 'complaint',
    list: 'list',
    detail: ':id/complaint-detail',
    qrCreate: 'create-qr',
    qrUpdate: ':id/qr-update',
    qrList: 'qr-list',
    report: 'report',
  },
  error: {
    notFound: '404',
    permissionDenied: '403',
    systemError: '500',
  },
  organization: {
    root: 'organization',
  },
  asset: {
    root: 'asset',
    list: 'list',
    assetType: 'asset-type',
  },
};
