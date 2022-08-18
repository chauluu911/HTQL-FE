import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MAX_LENGTH_EDITOR } from '@shared/constants/common.constant';
import { NOTIFICATION_URL } from '@shared/constants/component-url.constant';
import { CUSTOMER, INTERNAL } from '@shared/constants/customer.constants';
import { OWNER_TYPE } from '@shared/constants/file.constant';
import { LOCAL_STORAGE } from '@shared/constants/local-session-cookies.constants';
import {
  DEPARTMENTIDS_SELECT,
  DEPARTMENT_NOTI_SEND_STATUS,
  NOTIFICATION_SEND_STATUS,
  NOTIFICATION_TYPES_STATUS,
  SELECT_ALL_OPTION,
  TYPES_SELECT,
  USERIDS_SELECT,
  USER_NOTI_SEND_STATUS
} from '@shared/constants/notification.constant';
import { USER_STATUS } from '@shared/constants/user.constant';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { Department, IDepartment } from '@shared/models/department.model';
import { INotification, Notification } from '@shared/models/notification.model';
import { IUser, User } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth/auth.service';
import { DepartmentService } from '@shared/services/department.service';
import { FileService } from '@shared/services/file.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { NotificationService } from '@shared/services/notification.service';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import { ROUTER_ACTIONS } from '@shared/utils/router.utils';
import { differenceInCalendarDays } from 'date-fns';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-notification-update',
  templateUrl: './notification-update.component.html',
  styleUrls: ['./notification-update.component.scss'],
})
export class NotificationUpdateComponent implements OnInit, AfterViewInit {
  currentUser: IUser = {};
  notification: Notification = {};
  isInternal = false;
  form: FormGroup = new FormGroup({});

  notificationId: string | null = '';
  content = '';
  isInvalid = false;

  files: [] | any; // event file
  filesUpload = [];
  maxFileUpload = 5;

  // buildings: IBuilding[] = [];
  // floors: Floor[] = [];
  // customers: Customer[] = [];

  users: IUser[] = [];
  departments: IDepartment[] = [];

  buildingsPrevious: string[] = [];
  floorsPrevious: string[] = [];
  customersPrevious: string[] = [];

  // USER_LEVEL_CENTER = USER_LEVEL_CENTER;
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;

  navigationExtras: NavigationExtras = {};
  NOTIFICATION_URL = NOTIFICATION_URL;

  userStatus = USER_STATUS;
  NOTIFICATION_SEND_STATUS = NOTIFICATION_SEND_STATUS;
  NOTIFICATION_TYPES_STATUS = NOTIFICATION_TYPES_STATUS;
  sendTo: any;

  ROUTER_ACTIONS = ROUTER_ACTIONS;
  action = '';

  @ViewChild('datePicker') datePicker!: NzDatePickerComponent;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private fileService: FileService,
    private notificationService: NotificationService,
    private $localStorage: LocalStorageService,
    private authService: AuthService,
    private userService: UserService,
    private departmentService: DepartmentService,
    private toast: ToastService
  ) {
    this.currentUser = this.$localStorage.retrieve(LOCAL_STORAGE.PROFILE);
    this.activatedRoute.data.subscribe((res) => {
      this.action = res.action;
    });
    this.activatedRoute.paramMap.subscribe((res) => {
      this.isInternal = res.get('type') === INTERNAL.toLowerCase();
      this.notificationId = res.get('notificationId') || '';
      if (this.notificationId) {
        this.getNotificationById(this.notificationId);
      }

      const navigationExtras: NavigationExtras = {
        state: {
          tabIndex: this.isInternal ? INTERNAL : CUSTOMER,
        },
      };
    });
  }

  ngOnInit(): void {
    if (this.notificationId) {
      // this.isUpdate = true;
      this.getNotificationById(this.notificationId);
    } else {
      this.initFormGroup();
      this.getUserAutoComplete('');
      this.getDepartmentAutoComplete('');
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const notification = this.getFormValue();
    const originFiles: any[] = [];

    if (CommonUtil.stripHTML(notification.content).length > MAX_LENGTH_EDITOR) {
      this.toast.warning('error.editorMaxLength', {
        fieldName: this.translate.instant('model.notification.list.content'),
        length: MAX_LENGTH_EDITOR,
      });
      return;
    }

    if (this.filesUpload?.length > 0) {
      this.filesUpload.forEach((file: any) => {
        originFiles.push(file?.originFileObj);
      });

      this.fileService
        .uploadListFile(originFiles, '', OWNER_TYPE.NOTIFICATION)
        .subscribe((res) => {
          const ids = res.body?.data as any;
          notification.fileIds = ids.map((item: { id: string }) => item.id);
          this.save(notification);
        });
    } else {
      this.save(notification);
    }
  }

  save(body: object): void {
    this.notificationService.create(body).subscribe((res) => {
      if (res.status) {
        const navigationExtras: NavigationExtras = {
          state: {
            tabIndex: this.isInternal ? INTERNAL : CUSTOMER,
          },
        };
        this.toast.success('model.notification.success.create');
        this.router.navigate([`/notification/list`], navigationExtras);
      }
    });
  }

  onUpdateSubmit(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const notification = this.getFormValue();

    const originFileIds: string[] = [];
    const originFiles: any[] = [];

    if (CommonUtil.stripHTML(notification.content).length > MAX_LENGTH_EDITOR) {
      this.toast.warning('error.editorMaxLength', {
        fieldName: this.translate.instant('model.notification.list.content'),
        length: MAX_LENGTH_EDITOR,
      });
      return;
    }

    if (this.files?.length > 0) {
      this.files?.forEach((file: any) => {
        originFileIds.push(file.fileId);
      });
    }

    if (this.filesUpload?.length > 0) {
      this.filesUpload.forEach((file: any) => {
        originFiles.push(file?.originFileObj);
      });

      this.fileService
        .uploadListFile(originFiles, '', OWNER_TYPE.NOTIFICATION)
        .subscribe((res) => {
          const ids = res.body?.data as any;
          const fileUploadIds = ids.map(
            (item: { id: string }) => item.id
          ) as [];
          const fileOriginIds = [...originFileIds] as [];
          notification.fileIds = [...fileUploadIds, ...fileOriginIds];
          this.update(notification);
        });
    } else {
      const fileOriginIds = [...originFileIds] as [];
      notification.fileIds = [...fileOriginIds];
      this.update(notification);
    }
  }

  update(body: object): void {
    if (this.notification?.id) {
      this.notificationService
        .update(body, this.notification?.id)
        .subscribe((res) => {
          if (res.status) {
            const navigationExtras: NavigationExtras = {
              state: {
                tabIndex: this.isInternal ? INTERNAL : CUSTOMER,
              },
            };
            this.toast.success('model.notification.success.update');
            this.router.navigate([`/notification/list`], navigationExtras);
          }
        });
    }
  }

  onCancel(): void {
    this.router.navigate([`/notification/list`], this.navigationExtras);
  }

  getFormValue(): any {
    const data = { ...this.form.value };
    return {
      // buildingIds: this.buildings.length === data?.buildingIds?.length ? [] : data?.buildingIds,
      // floorIds: this.floors.length === data?.floorIds?.length ? [] : data?.floorIds,
      // organizationIds: this.customers.length === data?.customerIds?.length ? [] : data?.customerIds,
      types: data?.types,
      userIds: data?.userIds || [],
      departmentIds: data?.departmentIds || [],
      title: data?.title,
      content: data?.content,
      note: data?.note,
      sendTo: data?.sendTo,
      expectedNotificationAt: CommonUtil.getEndOfDay(
        new Date(data?.date).getTime()
      ),
      fileIds: [],
      eventTargetType: this.isInternal ? INTERNAL : CUSTOMER,
      // eventType:
      //   this.currentUser?.userLevel === USER_LEVEL_CENTER && !this.isInternal
      //     ? 'NOTIFICATION_EMAIL'
      //     : 'NOTIFICATION',
      // eventLevel:
      //   this.currentUser?.userLevel === USER_LEVEL_CENTER
      //     ? 'CENTER'
      //     : 'MANAGER',
    };
  }

  disabledBeforeToday(current: Date): boolean {
    // Can not select days before today
    return differenceInCalendarDays(current, new Date()) < 0;
  }

  getFiles(filesUpload: any): void {
    this.filesUpload = filesUpload;
  }

  getFilesOrigin(files: any): void {
    this.files = files;
  }

  onChangeData(content: string): void {
    this.form.controls.content?.setValue(content);
  }

  initFormGroup(
    notification?: INotification,
    isUpdate = false,
    isDetail = false
  ): void {
    this.form = this.fb.group({
      userIds: [
        {
          value: isUpdate
            ? this.mappingUsers(notification?.userIds || [], '')
            : [],
          disabled: this.action === ROUTER_ACTIONS.detail,
        },
        [Validators.required],
      ],
      departmentIds: [
        {
          value: isUpdate
            ? this.mappingDepartments(notification?.departmentIds || [], '')
            : [],
          disabled: this.action === ROUTER_ACTIONS.detail,
        },
        [Validators.required],
      ],
      sendTo: [
        {
          value: notification?.sendTo || null,
          disabled: this.action === ROUTER_ACTIONS.detail,
        },
        [Validators.required],
      ],
      types: [
        {
          value: this.mappingTypes(notification?.types || [], '') || [],
          disabled: this.action === ROUTER_ACTIONS.detail,
        },
        [Validators.required],
      ],
      title: [
        {
          value: isUpdate ? notification?.title : null,
          disabled: this.action === ROUTER_ACTIONS.detail,
        },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.TITLE_MAX_LENGTH.MAX),
        ],
      ],
      content: [
        {
          value: isUpdate ? this.notification?.content : null,
          disabled: this.action === ROUTER_ACTIONS.detail,
        },
        [Validators.required],
      ],
      note: [
        {
          value: isUpdate ? notification?.note : null,
          disabled: this.action === ROUTER_ACTIONS.detail,
        },
        [Validators.maxLength(LENGTH_VALIDATOR.NOTE_MAX_LENGTH.MAX)],
      ],
      date: [
        {
          value: isUpdate
            ? new Date(this.notification?.expectedNotificationAt)
            : new Date(),
          disabled: this.action === ROUTER_ACTIONS.detail,
        },
        [Validators.required],
      ],
    });
    if (this.action === ROUTER_ACTIONS.update) {
      if (notification?.sendTo) {
        this.disableForm(notification?.sendTo);
      }
    }
    // this.valueChangesForm();
  }

  disableForm(value: string): void {
    if (value === USER_NOTI_SEND_STATUS) {
      this.form.controls.departmentIds.disable();
    } else if (value === DEPARTMENT_NOTI_SEND_STATUS) {
      this.form.controls.userIds.disable();
    }
    // else if (value === BOTH_NOTI_SEND_STATUS) {
    //   this.form.controls.userIds.disable();
    //   this.form.controls.departmentIds.disable();
    // }
  }

  getUserAutoComplete(keyword: string, isLoading = false): void {
    this.userService
      .searchUsersAutoComplete(keyword, isLoading)
      .subscribe((res) => {
        this.users = res?.body?.data as Array<User>;
      });
  }

  getDepartmentAutoComplete(keyword: string, isLoading = false): void {
    this.departmentService.search({ keyword }, isLoading).subscribe((res) => {
      this.departments = res?.body?.data as Array<Department>;
    });
  }

  getNotificationById(notificationId: string): void {
    this.notificationService.find(notificationId, true).subscribe((res) => {
      this.notification = res?.body?.data as Notification;
      if (this.notification) {
        // this.form.controls.sendTo?.setValue(this.sendTo);
        this.getUserAutoComplete('');
        if (this.notification.userIds) {
          const userIds = this.mappingUsers(
            this.notification?.userIds || [],
            ''
          );
          this.form.controls.userIds?.setValue(userIds);
          this.form.controls.userIds?.updateValueAndValidity();
        }
        this.getDepartmentAutoComplete('');
        if (this.notification.departmentIds) {
          const departmentIds = this.mappingDepartments(
            this.notification?.departmentIds || [],
            ''
          );
          this.form.controls.departmentIds?.setValue(departmentIds);
          this.form.controls.userIds?.updateValueAndValidity();
        }

        if (this.notification.types) {
          const types = this.mappingTypes(this.notification?.types || [], '');
          this.form.controls.types?.setValue(types);
          this.form.controls.types?.updateValueAndValidity();
        }
      }
      this.files = this.notification?.eventFiles || [];

      this.initFormGroup(res?.body?.data as Notification, true, true);
    });
  }

  ngAfterViewInit(): void {
    if (this.notification) {
      this.form.controls.content?.setValue(this.notification.content);
    }
  }

  selectAll(controls: string, value: any[]): void {
    const formControl = this.form.controls[controls];
    if (formControl.value?.length === value.length) {
      formControl.setValue([]);
    } else {
      if (controls === USERIDS_SELECT) {
        formControl.setValue(this.mappingUsers(value, SELECT_ALL_OPTION));
      } else if (controls === DEPARTMENTIDS_SELECT) {
        formControl.setValue(this.mappingDepartments(value, SELECT_ALL_OPTION));
      } else if (controls === TYPES_SELECT) {
        formControl.setValue(this.mappingTypes(value, SELECT_ALL_OPTION));
      }
    }
  }

  mappingUsers(users: any[], value: string): (string | undefined)[] {
    if (value === SELECT_ALL_OPTION) {
      return users.map((user: IUser) => user.id);
    }
    return users;
  }

  mappingDepartments(
    departments: any[],
    value: string
  ): (string | undefined)[] {
    if (value === SELECT_ALL_OPTION) {
      return departments.map((department: IDepartment) => department.id);
    }
    return departments;
  }

  mappingTypes(types: any[], value: string): (string | undefined)[] {
    if (value === SELECT_ALL_OPTION) {
      return types.map((type: any) => type.value);
    }
    return types;
  }

  getTypeSend(value: any): void {
    if (value === USER_NOTI_SEND_STATUS) {
      this.form.controls.userIds.setValue([]);
      this.form.controls.userIds.enable();
      this.form.controls.userIds.setValidators(Validators.required);
      this.form.controls.userIds.updateValueAndValidity();
      this.form.controls.departmentIds.disable();
      this.form.controls.departmentIds.setValue([]);
      this.form.controls.departmentIds.clearValidators();
      this.form.controls.departmentIds.updateValueAndValidity();
    } else if (value === DEPARTMENT_NOTI_SEND_STATUS) {
      this.form.controls.departmentIds.enable();
      this.form.controls.departmentIds.setValidators(Validators.required);
      this.form.controls.departmentIds.updateValueAndValidity();
      this.form.controls.userIds.disable();
      this.form.controls.userIds.setValue([]);
      this.form.controls.userIds.clearValidators();
      this.form.controls.userIds.updateValueAndValidity();
    }
    // else if (value === BOTH_NOTI_SEND_STATUS) {
    //   this.selectAll(USERIDS_SELECT, this.users);
    //   this.form.controls.userIds.disable();
    //   this.form.controls.departmentIds.disable();
    //   this.form.controls.userIds.clearValidators();
    //   this.form.controls.departmentIds.clearValidators();
    //   this.form.controls.userIds.updateValueAndValidity();
    //   this.form.controls.departmentIds.updateValueAndValidity();
    // }
  }

  enterDatePicker(event: any): void {
    const date = event?.target?.value;
    if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
      this.form.controls.date?.setValue(this.form.controls.date?.value);
      this.datePicker.close();
    } else if (!this.disabledBeforeToday(CommonUtil.newDate(date))) {
      this.form.controls.date?.setValue(CommonUtil.newDate(date));
      this.datePicker.close();
    } else {
      this.form.controls.date?.setValue(this.form.controls.date?.value);
      this.datePicker.close();
    }
  }

  onHandleEditorInvalid(isInvalid: any): void {
    this.isInvalid = isInvalid;
  }

  getLimitLength(str: string, length?: number): string {
    return CommonUtil.getLimitLength(str, length);
  }
}
