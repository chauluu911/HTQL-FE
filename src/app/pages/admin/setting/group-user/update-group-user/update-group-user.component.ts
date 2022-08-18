import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STATUS_ACTIVE } from '@shared/constants/common.constant';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { GroupUser } from '@shared/models/group.model';
import { IUser } from '@shared/models/user.model';
import { GroupUserService } from '@shared/services/group-user.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-update-group-user',
  templateUrl: './update-group-user.component.html',
  styleUrls: ['./update-group-user.component.scss'],
})
export class UpdateGroupUserComponent implements OnInit {
  @Input() isUpdate = false;
  users: IUser[] = [];
  @Input() groupUserId = '';
  @Input() groupUser: GroupUser = new GroupUser();
  typeGroupUser = '';
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  form: FormGroup = new FormGroup({});
  members: IUser[] = [];
  @Input() isAddMember: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toast: ToastService,
    private groupUserService: GroupUserService,
    private modalRef: NzModalRef,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.searchUser('');
    this.initForm();
    if (this.isUpdate) {
      this.initData();
    }
  }
  initData(): void {
    this.groupUserService.find(this.groupUser.id).subscribe(
      (response: any) => {
        const data = response?.body?.data;
        this.groupUser = data;
        this.members = this.groupUser?.members || [];
        this.initForm();
      },
      (error: any) => {
        this.groupUser = {};
      }
    );
  }
  initForm(): void {
    this.form = this.fb.group({
      name: !this.isAddMember && [
        this.isUpdate ? this.groupUser?.name : '',
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX),
        ],
      ],
      description: !this.isAddMember && [
        this.isUpdate ? this.groupUser?.description : '',
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.DESC_MAX_LENGTH.MAX),
        ],
      ],
      code: !this.isAddMember && [
        {
          value: this.isUpdate ? this.groupUser?.code : '',
          disabled: this.isUpdate,
        },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.CODE_MAX_LENGTH.MAX),
        ],
      ],
      userMemberIds: [
        this.groupUser?.members ? this.mappingUsers(this.members) : [],
        [Validators.required],
      ],
    });
    // console.log(this.form.controls.userMemberIds);
  }
  onSubmit(): void {
    if (this.isAddMember) {
      this.addMemberToGroup();
    } else if (this.isUpdate) {
      this.updateGroupUser();
    } else {
      this.createGroupUser();
    }
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: null,
    });
  }

  private updateGroupUser(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const groupUser: GroupUser = {
      ...this.form.value,
    };
    const body = CommonUtil.trim(groupUser);
    if (this.groupUser?.id) {
      this.groupUserService
        .update(groupUser, this.groupUser.id)
        .subscribe((res) => {
          this.toast.success('model.groupUser.success.update');
          this.modalRef.close({
            success: true,
            value: groupUser,
          });
        });
    }
  }

  private createGroupUser(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const groupUser: GroupUser = {
      members: this.form.controls.userMemberIds.value,
      ...this.form.value,
    };
    this.groupUserService.create(groupUser).subscribe((res) => {
      this.toast.success('model.groupUser.success.create');
      this.modalRef.close({
        success: true,
        value: groupUser,
      });
    });
  }
  searchUser(keyword: any, isLoading = false): void {
    const options = {
      keyword,
      status: STATUS_ACTIVE,
    };
    this.userService
      .searchUsersAutoComplete(options, isLoading)
      .subscribe((res: any) => {
        this.users = [...res.body?.data, ...this.members];
      });
  }
  getLimitLength(str: string, length: number = 20): string {
    return CommonUtil.getLimitLength(str, length);
  }
  selectAll(controls: string, value: any[]): void {
    const formControl = this.form.controls[controls];
    if (formControl.value?.length === value.length) {
      formControl.setValue([]);
    } else {
      formControl.setValue(this.mappingUsers(value));
    }
  }
  mappingUsers(users: IUser[]): any {
    return users.map((user: IUser) => user.id);
  }
  private addMemberToGroup(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const data: any = {
      ...this.form.value,
    };
    const body = CommonUtil.trim(data);
    if (this.groupUserId) {
      this.groupUserService.addMemberToGroup(this.groupUserId, body).subscribe(
        (response: any) => {
          this.toast.success('model.groupUser.success.update');
          this.modalRef.close({
            success: true,
          });
        },
        (error: any) => {
          this.toast.error('model.groupUser.error.update');
        }
      );
    }
  }
}
