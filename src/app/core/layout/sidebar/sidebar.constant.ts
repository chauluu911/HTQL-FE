import { PERMISSION_CONSTANT } from '@shared/constants/Permisstion.constant';
import { ROUTER_UTILS } from '@shared/utils/router.utils';

export const SidebarConstant = [
  {
    path: ROUTER_UTILS.base.dashboard,
    title: 'sidebar.dashboard',
    icon: 'appstore',
    root: true,
    authorities: [],
  },
  {
    path: `${ROUTER_UTILS.employee.root}`,
    title: 'sidebar.humanResource',
    icon: 'user',
    root: false,
    authorities: ['department:view', 'employee:view'],
    submenu: [
      {
        path: `${ROUTER_UTILS.employee.root}/${ROUTER_UTILS.employee.list}`,
        title: 'sidebar.employee',
        authorities: ['employee:view'],
      },
      {
        path: ROUTER_UTILS.department.root,
        title: 'sidebar.department',
        authorities: ['department:view'],
      },
    ],
  },
  {
    path: ROUTER_UTILS.meeting.root,
    title: 'sidebar.meeting',
    icon: 'calendar',
    root: false,
    authorities: ['meeting:view'],
    submenu: [
      {
        path: `${ROUTER_UTILS.meeting.root}/${ROUTER_UTILS.room.root}`,
        title: 'sidebar.room',
        authorities: ['room:view'],
      },
      {
        path: `${ROUTER_UTILS.meeting.root}/${ROUTER_UTILS.meeting.list}`,
        title: 'sidebar.meet',
        authorities: ['meeting:view'],
      },
      {
        path: `${ROUTER_UTILS.meeting.root}/${ROUTER_UTILS.meeting.calender}`,
        title: 'sidebar.calender',
        authorities: ['meeting:view'],
      },
    ],
  },
  {
    path: `${ROUTER_UTILS.booking.root}`,
    title: 'sidebar.booking',
    icon: 'shop',
    authorities: [PERMISSION_CONSTANT.ORDER.VIEW],
    root: false,
    submenu: [
      {
        path: `${ROUTER_UTILS.booking.root}/${ROUTER_UTILS.booking.product}`,
        title: 'sidebar.product',
        root: true,
        authorities: ['order:view', 'employee:view'],
      },
      {
        path: `${ROUTER_UTILS.booking.root}/${ROUTER_UTILS.booking.menu}`,
        title: 'sidebar.menu',
        root: true,
        authorities: ['order:view'],
      },
      {
        path: `${ROUTER_UTILS.booking.root}/${ROUTER_UTILS.booking.order}`,
        title: 'sidebar.order',
        root: true,
        authorities: ['order:view', 'employee:view'],
      },
    ],
  },
  {
    title: 'sidebar.notification',
    icon: 'bell',
    root: false,
    authorities: ['notification:view'],
    submenu: [
      {
        path: `${ROUTER_UTILS.notification.root}/${ROUTER_UTILS.notification.list}`,
        title: 'model.notification.title',
        icon: 'tags',
        root: true,
        authorities: ['configuration:view'],
      },
      {
        path: `${ROUTER_UTILS.notification.root}/${ROUTER_UTILS.notification.me}`,
        title: 'model.notification.titleMe',
        icon: 'tags',
        root: true,
        authorities: ['configuration:view'],
      },
    ],
  },
  {
    path: ROUTER_UTILS.organization.root,
    title: 'sidebar.organization',
    icon: 'home',
    root: true,
    authorities: [],
  },
  {
    title: 'sidebar.asset',
    icon: 'gold',
    root: false,
    authorities: ['asset:view'],
    submenu: [
      {
        path: `${ROUTER_UTILS.asset.root}/${ROUTER_UTILS.asset.list}`,
        title: 'model.asset.titleAsset',
        icon: 'tags',
        root: true,
        authorities: ['configuration:view'],
      },
      {
        path: `${ROUTER_UTILS.asset.root}/${ROUTER_UTILS.asset.assetType}`,
        title: 'model.asset.titleAssetType',
        icon: 'tags',
        root: true,
        authorities: ['configuration:view'],
      },
    ],
  },
  {
    title: 'sidebar.settings',
    icon: 'setting',
    root: false,
    authorities: ['user:view', 'role:view', 'department:view'],
    submenu: [
      {
        path: `${ROUTER_UTILS.setting.root}/${ROUTER_UTILS.setting.configuration.list}`,
        title: 'model.configuration.title',
        icon: 'tags',
        root: true,
        authorities: ['configuration:view'],
      },
      {
        path: `${ROUTER_UTILS.setting.root}/${ROUTER_UTILS.setting.user}`,
        title: 'sidebar.user',
        authorities: ['user:view'],
      },
      {
        path: `${ROUTER_UTILS.setting.root}/${ROUTER_UTILS.setting.groupUser}`,
        title: 'sidebar.group-user',
        authorities: ['user:view'],
      },
      {
        path: `${ROUTER_UTILS.setting.root}/${ROUTER_UTILS.setting.role}`,
        title: 'sidebar.role',
        authorities: ['role:view'],
      },
      {
        path: `${ROUTER_UTILS.setting.root}/${ROUTER_UTILS.setting.client}`,
        title: 'sidebar.client',
        authorities: ['client:view'],
      },
    ],
  },
];
