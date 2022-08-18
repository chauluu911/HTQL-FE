import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AVATAR_PLACEHOLDER_FILE } from '@pages/admin/booking/common-booking/booking.constant';
import { JOB_TITLE_LIST } from '@shared/constants/department.constant';
import { STATUS } from '@shared/constants/status.constants';
import {
  ACTION_TYPE,
  USER_ACTIVE,
  USER_EMPLOYEE,
  USER_GENDER,
  USER_PROFILE_INTERNAL,
  USER_PROFILE_LDAP,
  USER_STATUS,
  USER_TYPE
} from '@shared/constants/user.constant';
import { LENGTH_VALIDATOR, VALIDATORS } from '@shared/constants/validators.constant';
import { ICustomer } from '@shared/models/customer.model';
import { IDepartment } from '@shared/models/department.model';
import { IEmploymentHistory } from '@shared/models/employment.model';
import { IRole } from '@shared/models/role.model';
import { User } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth/auth.service';
import { DepartmentService } from '@shared/services/department.service';
import { FileService } from '@shared/services/file.service';
import { LoadingService } from '@shared/services/helpers/loading.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { NotificationService } from '@shared/services/notification.service';
import { RoleService } from '@shared/services/role.service';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import { ROUTER_UTILS } from '@shared/utils/router.utils';
import Validation from '@shared/validators/confirmed-password.validator';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit {
  id = '';
  isUpdate = false;
  contact = false;
  isVisible = false;
  user: User = new User();
  typeUser = '';
  isInternal = false;
  isLdap = false;
  userTypeLocal = '';
  roles: IRole[] = [];
  departments: IDepartment[] = [];
  JOB_TITLE_LIST = JOB_TITLE_LIST;
  customers: ICustomer[] = [];
  form: FormGroup = new FormGroup({});
  passwordVisible = false;
  rePasswordVisible = false;
  files: [] | any;
  userStatus = USER_STATUS;
  userGender = USER_GENDER;
  userType = USER_TYPE;
  userActive = USER_ACTIVE;
  ownerId = '';
  userProfileInternal = USER_PROFILE_INTERNAL;
  userProfileLdap = USER_PROFILE_LDAP;
  contactObject: User = new User();
  ACTION_TYPE = ACTION_TYPE;
  groupConfirmUser = {
    title: 'model.user.managerUser.create',
    content: 'common.confirmSave',
    okText: 'action.save',
    callBack: () => {
    },
  };
  imageUrl?: any;
  keyword = '';
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  isChangeMyself = false;
  urlJoinTelegramBot = '';
  avatarPlaceHolder = AVATAR_PLACEHOLDER_FILE;

  @ViewChild('datePicker') datePicker!: NzDatePickerComponent;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private userService: UserService,
    private roleService: RoleService,
    // private modalRef: NzModalRef,
    private toast: ToastService,
    private fileService: FileService,
    private router: ActivatedRoute,
    private routerLink: Router,
    private loadingService: LoadingService,
    private authService: AuthService,
    private departmentService: DepartmentService,
    private notificationService: NotificationService,
  ) {
    this.contactObject = this.routerLink?.getCurrentNavigation()?.extras
      ?.state as User;
    this.router.paramMap.subscribe((res) => {
      this.id = res.get('id') || '';
    });
  }

  ngOnInit(): void {
    this.getProfile();
    this.initData();
    this.initForm();
    this.getDataParam();
    if (this.isChangeMyself) {
      this.notificationService.getUrlJoinTelegramBot().subscribe(res => this.urlJoinTelegramBot = res.body?.data || '');
    }
  }

  // Clear validate form theo từng tài khoản nội bộ, khách hàng ngoai, tài khoản liên hệ
  clearValid(): void {
    if (this.isInternal) {
      this.form.controls.password.clearValidators();
      this.form.controls.repeatPassword.clearValidators();
      this.form.controls.password.updateValueAndValidity();
      this.form.controls.repeatPassword.updateValueAndValidity();
    }
  }

  // Load data
  initData(): void {
    this.getDataParam();
    this.findId();
  }

  initForm(): void {
    this.form = this.fb.group(
      {
        employeeCode: [
          this.isUpdate ? this.user?.employeeCode : null,
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.CODE_MAX_LENGTH.MAX),
          ],
        ],
        roleIds: [
          {
            value: this.isUpdate
              ? this.user?.roles?.map((item) => item.id)
              : null,
            disabled: false,
          },
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.IDS_MAX_LENGTH.MAX),
          ],
        ],
        dayOfBirth: [
          this.isUpdate ? this.user?.dayOfBirth : null,
          [Validators.maxLength(LENGTH_VALIDATOR.BIRTH_MAX_LENGTH.MAX)],
        ],
        description: [
          this.isUpdate ? this.user?.description : null,
          [Validators.maxLength(LENGTH_VALIDATOR.DESC_MAX_LENGTH.MAX)],
        ],
        gender: [
          this.isUpdate ? this.user?.gender : null,
          [Validators.maxLength(LENGTH_VALIDATOR.GENDER_MAX_LENGTH.MAX)],
        ],
        username: [
          {
            value: this.isUpdate ? this.user?.username : null,
            disabled: this.isUpdate,
          },
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.USERNAME_MAX_LENGTH.MAX),
            Validators.pattern(VALIDATORS.USERNAME),
          ],
        ],
        password: [
          {
            value: this.isUpdate ? this.user?.password : null,
            disabled: this.isUpdate,
          },
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.PASSWORD_MAX_LENGTH.MAX),
            Validators.pattern(VALIDATORS.PASSWORD),
          ],
        ],
        repeatPassword: [
          {
            value: this.isUpdate ? this.user?.repeatPassword : null,
            disabled: this.isUpdate,
          },
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.PASSWORD_MAX_LENGTH.MAX),
            Validators.pattern(VALIDATORS.PASSWORD),
          ],
        ],

        fullName: [
          !this.contact
            ? this.isUpdate
              ? this.user?.fullName
              : null
            : this.contactObject
              ? this.contactObject.fullName
              : null,
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX),
          ],
        ],
        email: [
          !this.contact
            ? this.isUpdate
              ? this.user?.email
              : null
            : this.contactObject
              ? this.contactObject.email
              : null,
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.EMAIL_MAX_LENGTH.MAX),
            Validators.pattern(VALIDATORS.EMAIL),
          ],
        ],
        phoneNumber: [
          !this.contact
            ? this.isUpdate
              ? this.user?.phoneNumber
              : null
            : this.contactObject
              ? this.contactObject.phoneNumber
              : null,
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.PHONE_MAX_LENGTH.MAX),
            Validators.pattern(VALIDATORS.PHONE),
          ],
        ],

        status: [
          this.isUpdate ? this.user?.status : this.userActive,
          [Validators.maxLength(LENGTH_VALIDATOR.STATUS_MAX_LENGTH.MAX)],
        ],
        title: [
          this.isUpdate ? this.user?.title : null,
          [Validators.maxLength(LENGTH_VALIDATOR.TITLE_MAX_LENGTH.MAX)],
        ],
        departmentId: [
          {
            value: this.user?.departmentId,
            disabled: false,
          },
          [Validators.maxLength(LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX)],
        ],
        employment: this.fb.group({})
      },
      {
        validators: [Validation.match('password', 'repeatPassword')],
      }
    );
    this.addEmployment(this.user.employment);

    if (this.isChangeMyself) {
      this.disabledControllerForChangeMyProfile();
    }
  }

  // Kiểm tra mật khẩu khác nhau hay không
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getEmployment(): FormGroup {
    return this.form.get('employment') as FormGroup;
  }

  // Lấy param trên URL và kiểm tra đây là tài khoản nội bộ hay tài khoản khách hàng **/
  getDataParam(): void {
    let typeUser = this.router.snapshot.queryParamMap.get('typeUser');
    if (
      !typeUser &&
      window.location.href.includes(
        `${ROUTER_UTILS.setting.root}/${ROUTER_UTILS.setting.myProfile}`
      )
    ) {
      typeUser =
        this.authService.getCurrentUser()?.accountType === USER_EMPLOYEE
          ? USER_PROFILE_INTERNAL
          : USER_PROFILE_LDAP;
    }
    const contactUser = this.router.snapshot.queryParamMap.get('contact');
    if (
      typeUser !== this.userProfileInternal &&
      typeUser !== this.userProfileLdap
    ) {
      this.routerLink.navigate([`setting/user`]);
    }
    if (typeUser === this.userProfileInternal) {
      this.isInternal = true;
    } else {
      this.isLdap = true;
    }

    if (this.id) {
      this.isUpdate = true;
    } else {
      this.isUpdate = false;
      this.searchRoles('', true);
    }

    if (contactUser) {
      this.contact = true;
    }
    this.initForm();
    this.clearValid();
  }

  /*Tim thông tin cua user do*/
  findId(): void {
    if (
      !this.id &&
      window.location.href.includes(
        `${ROUTER_UTILS.setting.root}/${ROUTER_UTILS.setting.myProfile}`
      )
    ) {
      this.id = this.authService.getTokenPrivateKey();
      this.isChangeMyself = true;
    }
    if (!!this.id) {
      this.userService.find(this.id, true).subscribe((res: any) => {
        this.user = res.body?.data;
        // this.getAvatarFile(this.user.avatarFileId || '');
        if (this.user?.avatarFileUrl) {
          this.imageUrl = this.fileService.getFileResource(this.user.avatarFileUrl);
        }
        this.searchRoles(this.keyword, true);
        this.initForm();
        this.departmentService
          .autoComplete({ids: [this?.user?.departmentId || '']}, true)
          .subscribe((response) => {
            this.departments = response.body?.data as IDepartment[];
          });
        // this.clearValid();
      });
    } else {
      this.searchDepartments();
    }
  }

  // Lấy thông tin của tài khoản đang đăng nhập **/
  getProfile(): void {
    const user = this.authService.getCurrentUser() as User;
    this.ownerId = user?.id || '';
    this.userTypeLocal = user?.authenticationType || '';
  }

  // Lấy thông tin role fill ra ô select role **/
  searchRoles(keyword: any, isLoading = false): void {
    const options = {
      keyword: keyword.trim(),
    };
    this.roleService
      .searchAutoComplete(options, isLoading)
      .subscribe((res: any) => {
        this.roles = res.body?.data;
      });
  }

  // Lấy thông tin department fill ra ô select department **/
  searchDepartments(
    keyword?: string,
    status?: 'ACTIVE' | 'INACTIVE',
    isLoading = false
  ): void {
    const options = {
      keyword,
      status,
    };
    this.departmentService.autoComplete(options, isLoading).subscribe((res) => {
      this.departments = res.body?.data as IDepartment[];
    });
  }

  // Lấy thông tin file ảnh **/
  getAvatarFile(id: string): void {
    if (id) {
      this.imageUrl = this.fileService.viewFileResource(id);
    }
  }

  // Nút Tạo mới **/
  onSubmit(): void {
    // this.clearValid();
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const employment: IEmploymentHistory = this.getEmployment().getRawValue();
    employment.endDate = !!employment.endDate ? moment(employment.endDate).format('yyyy-MM-DD') : undefined;
    employment.startDate = !!employment.startDate ? moment(employment.startDate).format('yyyy-MM-DD') : undefined;
    employment.departmentId = this.form.get('departmentId')?.value;
    const user: User = {
      ...this.form.getRawValue(),
      file: null,
      avatarFileId: null,
      contactId: null,
      employment
    };

    if (this.form.get('dayOfBirth')?.value) {
      user.dayOfBirth = moment(user.dayOfBirth).format('yyyy-MM-DD');
    }
    if (this.files) {
      this.fileService
        .uploadFile(this.files, this.ownerId, this.userType)
        .subscribe((res: any) => {
          const file = res.body?.data;
          user.avatarFileId = file.id;
          // if (this.isInternal) {
          //   this.createInternal(user);
          // } else if (this.isLdap && this.contact) {
          //   this.createContact(user);
          // } else {
          this.createLdap(user);
          // }
        });
    } else {
      // if (this.isInternal) {
      //   this.createInternal(user);
      // } else if (this.isLdap && this.contact) {
      //   this.createContact(user);
      // } else {
      this.createLdap(user);
      // }
    }
  }

  // Tạo mới theo tài khoản nội bộ **/
  createInternal(user: User): void {
    const body = CommonUtil.trim(user);
    this.userService.create(body).subscribe((res) => {
      if (res.status === STATUS.SUCCESS_200) {
        this.toast.success('model.user.success.create');
        window.history.back();
      }
    });
  }

  // Tạo mới theo tài khoản khách hàng **/
  createLdap(user: User): void {
    this.userService.createLdap(user).subscribe((res) => {
      this.toast.success('model.user.success.create');
      window.history.back();
    });
  }

  // Cập nhật thông tin khách hàng **/
  onUpdateSubmit(): void {
    // this.clearValid();
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const employment: IEmploymentHistory = this.getEmployment().getRawValue();
    employment.endDate = !!employment.endDate ? moment(employment.endDate).format('yyyy-MM-DD') : undefined;
    employment.startDate = !!employment.startDate ? moment(employment.startDate).format('yyyy-MM-DD') : undefined;
    employment.departmentId = this.form.get('departmentId')?.value;

    const user: User = {
      username: this.user.username,
      ...this.form.getRawValue(),
      employment,
    };

    if (this.user?.avatarFileId) {
      user.avatarFileId = this.user?.avatarFileId;
    }

    if (this.form.get('dayOfBirth')?.value) {
      user.dayOfBirth = moment(user.dayOfBirth).format('yyyy-MM-DD');
    }
    if (this.files) {
      this.fileService
        .uploadFile(this.files, this.ownerId, this.userType)
        .subscribe((res: any) => {
          const file = res.body?.data;
          user.avatarFileId = file.id;
          this.onUpdate(user);
        });
    } else {
      this.onUpdate(user);
    }
  }

  onUpdate(user: User): void {
    if (this.isChangeMyself) {
      this.onUpdateMyProfile(user);
    } else {
      if (this.user?.id) {
        this.userService.update(user, this.user.id).subscribe((res) => {
          this.toast.success('model.user.success.update');
          window.history.back();
        });
      }
    }
  }

  onUpdateMyProfile(user: User): void {
    if (this.user.id) {
      this.authService.updateMyProfile(user, true).subscribe((res) => {
        this.toast.success('model.user.success.update');
        window.history.back();
      });
    }
  }

  // Lấy file **/
  getFiles(files: any): void {
    if (files) {
      this.files = files[0];
      this.getBase64(files[0]).then((data) => {
        this.imageUrl = data;
      });
    }
  }

  getBase64(image: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  // Nút hủy **/
  onCancel(): void {
    window.history.back();
  }

  openConfirm(actionType: string): void {
    if (actionType === ACTION_TYPE.CREATE_USER) {
      this.groupConfirmUser.callBack = this.onSubmit.bind(this);
    } else if (actionType === ACTION_TYPE.UPDATE_USER) {
      this.groupConfirmUser.title = 'model.user.managerUser.update';
      this.groupConfirmUser.callBack = this.onUpdateSubmit.bind(this);
    }
    this.isVisible = true;
  }

  /*handle confirm*/
  handleConfirm(result: { success: boolean }): void {
    if (!!result && result.success) {
    }
    this.groupConfirmUser.callBack = () => {
    };
    this.isVisible = false;
  }

  disabledAfterToday(current: Date): boolean {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  }

  enterDatePicker(event: any): void {
    const date = event?.target?.value;
    if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
      this.form.controls.dayOfBirth.setValue(
        this.form.controls.dayOfBirth.value
      );
      this.datePicker.close();
    } else if (!this.disabledAfterToday(CommonUtil.newDate(date))) {
      this.form.controls.dayOfBirth.setValue(CommonUtil.newDate(date));
      this.datePicker.close();
    } else {
      this.form.controls.dayOfBirth.setValue(
        this.form.controls.dayOfBirth.value
      );
      this.datePicker.close();
    }
  }

  disabledControllerForChangeMyProfile(): void {
    this.form.controls?.employeeCode?.disable();
    this.form.controls?.title?.disable();
    this.form.controls?.departmentId?.disable();
    this.form.controls?.status?.disable();
    this.form.controls.roleIds?.disable();
    this.getEmployment().get('title')?.disable();
    this.getEmployment().get('startDate')?.disable();
    this.getEmployment().get('endDate')?.disable();
  }

  getLimitLength(value: string, limit: number): string {
    return CommonUtil.getLimitLength(value, limit);
  }

// bắt sự kiện khi chọn phòng ban **/
  onChangeDepartment(event: string): void {
    const employment: IEmploymentHistory = {departmentId: event};
    this.addEmployment(employment);
  }

  addEmployment(employment?: IEmploymentHistory): void {
    this.getEmployment().addControl('title', new FormControl(employment?.title, []));
    this.getEmployment().addControl('startDate', new FormControl(employment?.startDate, []));
    this.getEmployment().addControl('endDate', new FormControl(employment?.endDate, []));
  }

  onChangeDate(rangeDate: { fromDate?: Date; toDate?: Date }): void {
    this.getEmployment().get('startDate')?.setValue(rangeDate.fromDate);
    this.getEmployment().get('endDate')?.setValue(rangeDate.toDate);
  }

  copyToClipboard(textToCopy: string): Promise<void> {
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      return navigator.clipboard.writeText(textToCopy);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      textArea.style.position = 'fixed'; // avoid scrolling to bottom
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise<void>((res, rej) => {
        document.execCommand('copy') ? res() : rej();
        textArea.remove();
      });
    }
  }

  copyText(): void {
    this.copyToClipboard(this.urlJoinTelegramBot)
      .then(() =>
        this.toast.success('common.copySuccess')
      )
      .catch((e) =>
        this.toast.error('common.copyFail')
      );
  }
}
