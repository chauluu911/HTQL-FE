import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STATUS } from '@shared/constants/status.constants';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { Department, IDepartment } from '@shared/models/department.model';
import { SelectNode } from '@shared/models/tree.model';
import { DepartmentService } from '@shared/services/department.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-update-department',
  templateUrl: './update-department.component.html',
})
export class UpdateDepartmentComponent implements OnInit {
  @Input() isUpdate = false;
  @Input() department: Department = new Department();
  form: FormGroup = new FormGroup({});
  listDepartments: IDepartment[] = [];
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  parent: IDepartment = {};

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private modalRef: NzModalRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAllDepartment();
  }

  initForm(): void {
    this.form = this.fb.group({
      code: [
        {
          value: this.isUpdate ? this.department?.code : '',
          disabled: this.isUpdate,
        },

        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX),
        ],
      ],
      name: [
        this.isUpdate ? this.department?.name : '',

        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX),
        ],
      ],
      description: [
        this.isUpdate ? this.department?.description : '',

        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.DESC_MAX_LENGTH.MAX),
        ],
      ],
      parentId: [
        this.isUpdate ? this.department?.parentId : '',
        [Validators.maxLength(LENGTH_VALIDATOR.DESC_MAX_LENGTH.MAX)],
      ],
    });
  }

  onSubmit(): void {
    if (this.isUpdate) {
      this.updateDepartment();
    } else {
      this.createDepartment();
    }
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: null,
    });
  }

  private updateDepartment(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const department: Department = {
      ...this.form.value,
    };
    const body = CommonUtil.trim(department);
    if (this.department?.id) {
      this.departmentService
        .update(department, this.department.id)
        .subscribe((res) => {
          if (res.status === STATUS.SUCCESS_200) {
            this.toast.success('model.department.updateSuccess');
            this.modalRef.close({
              success: true,
              value: department,
            });
          }
        });
    }
  }

  private createDepartment(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const department: Department = {
      ...this.form.value,
    };

    this.departmentService.create(department).subscribe((res) => {
      if (res.status === STATUS.SUCCESS_200) {
        this.toast.success('model.department.createSuccess');
        this.modalRef.close({
          success: true,
          value: department,
        });
      }
    });
  }

  private getAllDepartment(): void {
    if (this.isUpdate) {
      const department: Department = {
        ...this.form.value,
      };
      this.departmentService
        .getAllExcludeProgeny(this.department?.id)
        .subscribe((data) => {
          const lts = data.body?.data || [];
          this.listDepartments = this.generateTree(lts);
        });
    } else {
      this.departmentService.getAllRoots().subscribe((data) => {
        const lts = data.body?.data || [];
        this.listDepartments = lts.map((it) =>
          this.appendDepartmentTree(it, '')
        );
      });
    }
  }
  // For Update
  mapEntityToSelectNode(node: Department): SelectNode {
    let isLeaf = false;
    if (!!node.children && node.children.length > 0) {
      isLeaf = false;
    }
    return {
      title: node.name,
      value: node.id,
      key: node.id,
      isLeaf,
      parentKey: node.parentId,
      children: [],
    } as SelectNode;
  }
  generateTree(departments: Department[]): SelectNode[] {
    const mapper = departments.map((de) => {
      return this.mapEntityToSelectNode(de);
    });
    // tslint:disable-next-line:no-debugger
    const idMapping = mapper.reduce((acc: { [key: string]: any }, el, i) => {
      if (el?.key) {
        // tslint:disable-next-line:no-non-null-assertion
        acc[el.key!] = i;
      }
      return acc;
    }, {});
    const root: SelectNode[] = [] as SelectNode[];
    mapper.forEach((el) => {
      // Handle the root element
      if (!el.parentKey) {
        root.push(el);
        return;
      }
      // Use our mapping to locate the parent element in our data array
      const parentEl = mapper[idMapping[el.parentKey]];
      // Add our current el to its parent's `children` array
      parentEl.children = [...(parentEl?.children || []), el];
      parentEl.children.forEach((item) => {
        if (!item.title.includes(parentEl.title)) {
          item.title = parentEl.title + '/' + item.title;
        }
      });
    });
    return root;
  }
  // For Create
  appendDepartmentTree(department: Department, title: string | any): any {
    department.name =
      title.length === 0 ? department.name : title + '/' + department.name;
    let isLeaf = false;
    if (!!department.children && department.children.length > 0) {
      isLeaf = false;
    }
    return {
      title: department.name,
      value: department.id,
      key: department.id,
      isLeaf,
      parentKey: department.parentId,
      children:
        (!!department.children && [
          ...department.children.map((child: Department) => {
            return this.appendDepartmentTree(child, department.name);
          }),
        ]) ||
        [],
    };
  }
  onExpandChange(e: NzFormatEmitEvent): void {
    const node = e.node;
    if (
      !this.isUpdate &&
      node &&
      node.getChildren().length === 0 &&
      node.isExpanded
    ) {
      this.departmentService.getTreeView(node.key).subscribe((res) => {
        let children = res.body?.data?.children || [];
        children = children.map((it) =>
          this.appendDepartmentTree(it, e.node?.origin.title)
        );
        node.addChildren(children);
      });
    }
  }
}
