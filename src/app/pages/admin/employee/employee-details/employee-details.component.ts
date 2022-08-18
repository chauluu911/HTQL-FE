import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AVATAR_PLACEHOLDER_FILE } from '@pages/admin/booking/common-booking/booking.constant';
import { STATUS_ACTIVE } from '@shared/constants/common.constant';
import { Employee, IEmployee } from '@shared/models/employee.model';
import { AuthService } from '@shared/services/auth/auth.service';
import { EmployeeService } from '@shared/services/employee.service';
import { FileService } from '@shared/services/file.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
})
export class EmployeeDetailsComponent implements OnInit, AfterViewInit {
  form: FormGroup = new FormGroup({});
  employee: Employee = new Employee();
  employeeId = '';
  imageUrl?: any;
  STATUS_ACTIVE = STATUS_ACTIVE;
  OTHER = 'OTHER';
  MALE = 'MALE';
  vCardData = '';
  files: [] | any;
  // Tab
  tabIndex = 0;
  tabIndexAvatar = 0;
  INFO = {
    GENERAL: 0,
    WORK: 1,
  };
  avatarPlaceHolder = AVATAR_PLACEHOLDER_FILE;

  constructor(
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private employeeService: EmployeeService,
    private fileService: FileService,
    private translateService: TranslateService,
    private authService: AuthService
  ) {
    this.router.paramMap.subscribe((res) => {
      this.employeeId = res.get('id') || '';
    });
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.getProfile();
    this.initForm();
  }
  initForm() {
    this.form = this.fb.group({
      fullName: this.employee.fullName,
      email: this.employee.email,
      phoneNumber: this.employee.phoneNumber,
      // Thêm mới, cập nhật
      dayOfBirth: this.employee.dayOfBirth,
      gender: this.employee.gender,
      avatarFileId: this.employee.avatarFileId,
      //   file?: any;
      avatarFileUrl: this.employee.avatarFileUrl,
      employeeCode: this.employee.employeeCode,
      description: this.employee.description,
      status: this.employee.status,
      departmentName: this.employee.departmentName,
      employeeLevel: this.employee.employeeLevel,
    });
  }

  getProfile(): void {
    this.employeeService.find(this.employeeId, true).subscribe((res: any) => {
      this.getContactQRCode(res.body?.data);
      this.employee = res.body?.data;
      // this.getAvatarFile(this.user.avatarFileId || '');
      if (this.employee?.avatarFileUrl) {
        this.imageUrl = this.fileService.getFileResource(this.employee.avatarFileUrl);
      }
      this.initForm();
    });
  }

  getFirstLetter() {
    return this.employee?.fullName?.charAt(0).toLocaleUpperCase().toString();
  }

  getResource(id: string): void {
    if (id) {
      this.imageUrl = this.fileService.viewFileResource(id);
    }
  }
  format(value: any, type: string): any {
    if (value && type === 'status') {
      return this.translateService.instant(
        ['common', value.toLowerCase()].join('.')
      );
    }
  }

  // Set infomation to vcard qrCode
  getContactQRCode(employee: IEmployee): void {
    // Properties available in vCard version 3.0 are listed below. They have to be separated through line breaks.
    // Properties can be defined in any order (except BEGIN, END, VERSION).
    const name =
      (employee.companyCode ? employee.companyCode?.toUpperCase() + ' ' : '') +
      (employee.fullName ? employee.fullName?.toUpperCase() : 'USER');
    this.vCardData =
      `BEGIN:VCARD` +
      `\nN:${name}` +
      `\nTEL;TYPE=work,VOICE:${employee.phoneNumber}` +
      `\nEMAIL:${employee.email}` +
      `\nBDAY:${employee.dayOfBirth}` +
      (employee.jobTitle ? `\nTITLE:${employee.jobTitle}` : '') +
      (employee.accountTelegram ? `\nNOTE:${employee.accountTelegram}` : '') +
      `\nVERSION:3.0\nEND:VCARD`;
  }

  onChangeTab(tabIndex: number): any {
    this.tabIndex = tabIndex;
  }

  onChangeTabAvatar(tabIndexAvatar: number): any {
    this.tabIndexAvatar = tabIndexAvatar;
  }
  getLabelTitle(title: string) {
    return `common.jobTitle.${title.toLowerCase()}`;
  }
}
