import {Component, Input, OnInit} from '@angular/core';
import {ClientStatus, IClient} from '@shared/models/client.model';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {LENGTH_VALIDATOR} from '@shared/constants/validators.constant';
import {USER_STATUS} from '@shared/constants/user.constant';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IValidateMessage} from '@shared/interface/validate-message';
import Validation from '@shared/validators/confirmed-password.validator';
import {IRole} from '@shared/models/role.model';
import {RoleService} from '@shared/services/role.service';
import {ClientService} from '@shared/services/client.service';
import {ToastService} from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';

@Component({
  selector: 'app-client-update',
  templateUrl: './client-update.component.html',
  styleUrls: ['./client-update.component.scss']
})
export class ClientUpdateComponent implements OnInit {


  @Input() client?: IClient;
  LENGTH_VALIDATOR = LENGTH_VALIDATOR
  userStatus = USER_STATUS;
  translatePath = 'model.client.';
  action: {
    select: string,
    input: string
  };
  title: string;
  public validateMessages: IValidateMessage[] = [
    {
      field: 'name',
      fieldName: this.getTranslate('clientName'),
      valid: [{type: 'required'}]
    },
    {
      field: 'roleId',
      fieldName: this.getTranslate('role'),
      valid: [{type: 'required'}]
    },
    {
      field: 'status',
      fieldName: this.getTranslate('status'),
      valid: [{type: 'required'}]
    }
  ]
  form: FormGroup = new FormGroup({});
  roles: IRole[] = [];
  currentRole?: IRole;
  loading: boolean = false;
  createSuccess = false;

  constructor(private modalRef: NzModalRef,
              private translateService: TranslateService,
              private roleService: RoleService,
              private clientService: ClientService,
              private toastService: ToastService,
              private fb: FormBuilder) {
    this.action = {
      input: this.translateService.instant('common.input'),
      select: this.translateService.instant('common.select')
    }
    this.title = this.getTranslate('createClient')
  }

  ngOnInit(): void {
    if (this.client?.id) {
      // setTimeout(() => {
      this.title = this.getTranslate('updateClient')
      // }, 100);
    }
    this.initForm();
    this.searchRoles();
    // if (this.client?.roleId) {
    //   this.roleService.findById(this.client.roleId).subscribe(res => {
    //     this.currentRole = res.body?.data as IRole;
    //   });
    // }
  }

  /*  ngAfterViewChecked(): void {
      this.title = this.getTranslate('updateClient')
    }*/
  initForm(): void {
    this.form = this.fb.group({
      name: [{value: this.client?.name, disabled: false}, [Validation.notBlank]],
      roleId: [{value: this.client?.roleId, disabled: false}, [Validators.required]],
      status: [{value: this.client?.status || ClientStatus.ACTIVE, disabled: false}, [Validators.required]],
    });
  }

  onSubmit(): void {

    if (this.client?.id) {
      this.update();
    } else {
      this.create();
    }
  }

  create(): void {
    const data = this.form.value as IClient;
    this.loading = true;
    this.clientService.create(data).subscribe(res => {
        this.client = res.body?.data as IClient;
        this.toastService.success(this.getTranslate('createSuccess'));
        this.createSuccess = true;
        this.loading = false;
        // this.modalRef.close({
        //   success: true,
        //   value: res.body?.data as IClient,
        // });
      }
    );
  }

  update(): void {
    if (this.client?.id) {
      const data = this.form.value as IClient;
      this.clientService.update(this.client?.id, data).subscribe(res => {
        this.toastService.success(this.getTranslate('updateSuccess'));
        this.modalRef.close({
          success: true,
          value: res.body?.data as IClient,
        });
      });
    }
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: null,
    })
  }

  getTranslate(key: string, type?: 'SELECT' | 'INPUT'): string {
    const value = this.translateService.instant(this.translatePath + key);
    if (type === 'SELECT') {
      return `${this.action.select} ${value?.toLowerCase()}`;
    } else if (type === 'INPUT') {
      return `${this.action.input} ${value?.toLowerCase()}`;
    }
    return value;
  }

  searchRoles(keyword?: string): void {
    this.roleService
      .searchAutoComplete({keyword}, false)
      .subscribe(res => {
        this.roles = res.body?.data as Array<IRole>;
      });
  }

  copy(): void {
    if (this.client?.secretToken) {
      CommonUtil.copyToClipboard(this.client?.secretToken).then(() => {
        this.toastService.success(this.getTranslate('copySuccess'));
      });
    }
  }
}
