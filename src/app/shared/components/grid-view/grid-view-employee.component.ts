import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTER_UTILS } from '@shared/utils/router.utils';
import { Employee, IEmployee } from '../../models/employee.model';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'mb-grid-view-employee',
  templateUrl: './grid-view-employee.component.html',
  styleUrls: ['./grid-view-employee.component.scss'],
})
export class GridViewEmployeeComponent implements OnInit {
  @Input() data: Employee[] = [];
  @Input() getLimitLength: any;
  @Input() columns: number = 4;
  constructor(private fileService: FileService, private router: Router) {}

  ngOnInit(): void {
    console.log(this.data);
  }
  getFirstLetter(name: string): string {
    return name.charAt(0).toLocaleUpperCase().toString();
  }
  detail(employee: IEmployee): void {
    this.router.navigate([ROUTER_UTILS.employee.root, employee.id]);
  }
  getResource(avatarFileUrl: string): string {
    return this.fileService.getFileResource(avatarFileUrl);
  }
}
