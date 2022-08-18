export const DEPARTMENT_ACTIVE = 'ACTIVE';
export const DEPARTMENT_INACTIVE = 'INACTIVE';
export const DEPARTMENT_STATUS = [
  { value: DEPARTMENT_ACTIVE, label: 'model.department.active' }, // Trạng thái hoạt động
  { value: DEPARTMENT_INACTIVE, label: 'model.department.inactive' }, // Trạng thái không hoạt động
];

export const JOB_TITLE = {
  MANAGER: {
    value: 'MANAGER',
    label: 'model.job.manager',
  },
  VICE_MANAGER: {
    value: 'VICE_MANAGER',
    label: 'model.job.vice_manager',
  },
  EMPLOYEE: {
    value: 'EMPLOYEE',
    label: 'model.job.employee',
  },
  LEADER: {
    value: 'LEADER',
    label: 'model.job.leader',
  },
};
export const JOB_TITLE_LIST = [
  JOB_TITLE.MANAGER,
  JOB_TITLE.VICE_MANAGER,
  JOB_TITLE.LEADER,
  JOB_TITLE.EMPLOYEE,
];
