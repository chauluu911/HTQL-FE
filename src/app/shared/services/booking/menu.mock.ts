import { MenuDetailResponse } from '@shared/models/booking/menu.model';

const menu: MenuDetailResponse = {
  createdBy: 'anonymous',
  createdAt: 1653452853609,
  lastModifiedBy: 'anonymous',
  lastModifiedAt: 1653553670140,
  id: '2537f8fa-4643-4a93-9b05-9b1e9dc48066',
  code: 'MENU202215',
  title: 'Đặt cơm ngày 26/05',
  products: '5676f66b-3e11-4643-a619-4db764166153',
  price: 10.0,
  closedAt: 1653714732000,
  status: 'INCOMPLETE_PAYMENT',
  type: 'MENU_LUNCH',
  note: 'Mọi người chú ý đặt sớm',
  deleted: false,
  productList: [
      {
          createdBy: 'anonymous',
          createdAt: 1653380205876,
          lastModifiedBy: 'anonymous',
          lastModifiedAt: 1653552857564,
          id: '5676f66b-3e11-4643-a619-4db764166153',
          name: 'Mỳ tôm',
          type: 'lunch',
          deleted: false
      }
  ],
  orderList: [
      {
          createdBy: 'anonymous',
          createdAt: 1653361431556,
          lastModifiedBy: 'anonymous',
          lastModifiedAt: 1653553944622,
          id: 'f5069542-d7f0-4c61-ad45-178eee8371c1',
          menuId: '2537f8fa-4643-4a93-9b05-9b1e9dc48066',
          totalMoney: 0.0,
          status: 'COMPLETED_PAYMENT',
          deleted: false
      },
      {
          createdBy: 'anonymous',
          createdAt: 1653554009009,
          lastModifiedBy: 'anonymous',
          lastModifiedAt: 1653554009009,
          id: '743faf58-9e68-47e3-ac75-f71dcad24bf1',
          menuId: '2537f8fa-4643-4a93-9b05-9b1e9dc48066',
          totalMoney: 0.0,
          status: 'INCOMPLETE_PAYMENT',
          deleted: false
      }
  ],
  menuFiles: []
};

export {
    menu,
};

