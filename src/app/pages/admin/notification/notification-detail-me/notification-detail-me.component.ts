import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  NOTIFICATION_ME_URL,
  NOTIFICATION_URL,
} from '@shared/constants/component-url.constant';
import { CUSTOMER, INTERNAL } from '@shared/constants/customer.constants';
import { LOCAL_STORAGE } from '@shared/constants/local-session-cookies.constants';
import {
  DEPARTMENT_NOTI_SEND_STATUS,
  EMAIL,
  NOTIFICATION,
  NOTIFICATION_SEND_STATUS,
  NOTIFICATION_TYPES_STATUS,
  USER_NOTI_SEND_STATUS,
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
  selector: 'app-notification-detail-me',
  templateUrl: './notification-detail-me.component.html',
  styleUrls: ['./notification-detail-me.component.scss'],
})
export class NotificationDetailMeComponent implements OnInit, AfterViewInit {
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
  NOTIFICATION_ME_URL = NOTIFICATION_ME_URL;

  userStatus = USER_STATUS;
  NOTIFICATION_SEND_STATUS = NOTIFICATION_SEND_STATUS;
  NOTIFICATION_TYPES_STATUS = NOTIFICATION_TYPES_STATUS;
  notiSendStatus: any;

  ROUTER_ACTIONS = ROUTER_ACTIONS;
  action = '';
  isMeNoti = true;
  SENT_USER = USER_NOTI_SEND_STATUS;

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
    if (this.router.url.startsWith('/notification/me')) {
      this.isMeNoti = true;
    } else {
      this.isMeNoti = false;
    }
    this.activatedRoute.paramMap.subscribe((res) => {
      this.isInternal = res.get('type') === INTERNAL.toLowerCase();
      this.notificationId = res.get('notificationId') || '';
      if (this.notificationId && this.isMeNoti) {
        this.getMeNotificationById(this.notificationId);
      }
      if (this.notificationId && !this.isMeNoti) {
        this.getDetailNotificationById(this.notificationId);
      }

      const navigationExtras: NavigationExtras = {
        state: {
          tabIndex: this.isInternal ? INTERNAL : CUSTOMER,
        },
      };
    });
  }

  ngOnInit(): void {
    // if (this.notificationId) {
    //   this.getMeNotificationById(this.notificationId);
    // } else {
    //   this.initFormGroup();
    // }
  }

  onCancel(): void {
    this.router.navigate([`/notification/list`], this.navigationExtras);
  }

  getFormValue(): any {
    const data = { ...this.form.value };
    return {
      types: data?.types,
      userIds: data?.userIds || [],
      departmentIds: data?.departmentIds || [],
      title: data?.title,
      content: data?.content,
      note: data?.note,
      expectedNotificationAt: CommonUtil.getEndOfDay(
        new Date(data?.date).getTime()
      ),
      fileIds: [],
      eventTargetType: this.isInternal ? INTERNAL : CUSTOMER,
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
      senderUsername: [
        {
          value: notification?.senderUsername || null,
          disabled: this.action === ROUTER_ACTIONS.detail,
        },
      ],
      title: [
        {
          value: notification?.title || null,
          disabled: this.action === ROUTER_ACTIONS.detail,
        },
      ],
      content: [
        {
          value: this.notification?.content || null,
          disabled: this.action === ROUTER_ACTIONS.detail,
        },
      ],
      note: [
        {
          value: notification?.note || null,
          disabled: this.action === ROUTER_ACTIONS.detail,
        },
      ],
      date: [
        {
          value: new Date(this.notification?.sendAt) || new Date(),
          disabled: this.action === ROUTER_ACTIONS.detail,
        },
      ],
    });
    // this.valueChangesForm();
  }

  getMeNotificationById(notificationId: string): void {
    this.notificationService
      .findByIdMe(notificationId, true)
      .subscribe((res) => {
        this.notification = res?.body?.data as Notification;
        this.files = this.notification?.eventFiles || [];
        this.initFormGroup(res?.body?.data as Notification, true, true);
      });
  }

  getDetailNotificationById(notificationId: string): void {
    this.notificationService.find(notificationId, true).subscribe((res) => {
      this.notification = res.body?.data as Notification;
      this.files = this.notification?.eventFiles || [];
    });
  }

  ngAfterViewInit(): void {
    if (this.notification) {
      this.form.controls.content?.setValue(this.notification.content);
    }
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

  getUserName(users: User[]): string {
    const names = users ? users.map((user) => user.fullName) : '';
    return names.toString();
  }

  getDepartmentName(departments: Department[]): string {
    const names = departments
      ? departments.map((department) => department.name)
      : '';
    return names.toString();
  }

  getTypeNoti(types: string[]): string {
    const result: string[] = [];
    if (types && types.length > 0) {
      types.forEach((type) => {
        if (type === NOTIFICATION) {
          result.push(this.translate.instant('model.notification.notiType'));
        } else if (type === EMAIL) {
          result.push(this.translate.instant('model.notification.emailType'));
        }
      });
    }
    return result.toString();
  }

  getTypeSend(types: string): string {
    console.log(types);
    if (types) {
      if (types === DEPARTMENT_NOTI_SEND_STATUS) {
        return this.translate.instant('model.notification.departmentType');
      } else {
        return this.translate.instant('model.notification.personType');
      }
    }
    return '';
  }
}
