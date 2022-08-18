import {
  Component,
  EventEmitter,
  Input,
  isDevMode,
  OnInit,
  Output
} from '@angular/core';
import { FILE_SIZE, MAX_FILE_SIZE } from '@shared/constants/file.constant';
import { ToastService } from '@shared/services/helpers/toast.service';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer, of } from 'rxjs';

@Component({
  selector: 'mb-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  @Input() isImport = false;
  @Input() typeDownload = '';
  @Input() filesUpload: NzUploadFile[] = [];
  @Input() multiple = false;
  @Input() acceptTypeFiles: string[] = [
    'default' || 'docx' || 'excel' || 'pdf' || 'image',
  ];
  @Output() emitter: EventEmitter<any> = new EventEmitter();
  readonly typeFiles = [
    {
      type: 'docx',
      value:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    {
      type: 'docx',
      value: 'application/msword',
    },
    {
      type: 'excel',
      value:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    {
      type: 'excel',
      value: 'application/vnd.ms-excel',
    },
    {
      type: 'pdf',
      value: 'application/pdf',
    },
    {
      type: 'image',
      value: 'image/jpeg',
    },
    {
      type: 'image',
      value: 'image/png',
    },
  ];
  isSingle: boolean = false;
  loading = false;
  acceptFiles: string[] = [];
  files: NzUploadFile[] = [];
  resultStatus: boolean = false;
  fileResultName: string = 'ResultFile.xlsx';
  urlResultFile: any = null;
  constructor(
    private userService: UserService,
    private modalRef: NzModalRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.filesAccept();
  }

  handleChange({ file, fileList, event }: NzUploadChangeParam): void {
    if (this.multiple) {
      this.files = this.valid(fileList);
    } else {
      this.files = this.valid([file]);
    }
    // this.emitter.emit(this.files);
  }

  beforeUpload = (
    file: NzUploadFile,
    fileList: NzUploadFile[]
  ): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      if (!file) {
        return;
      }
      const isFileAccept = this.acceptFiles.includes(file.type || '');
      if (!isFileAccept) {
        let type = '';
        if (this.acceptTypeFiles.includes('default')) {
          type = ['docx', 'excel', 'pdf', 'image'].toString();
        } else {
          type = this.acceptTypeFiles.toString();
        }
        this.toast.warning('common.fileAccept', { type });
        observer.complete();
        return;
      }
      const isLessThan = (file.size || 0 / 1024 / 1024 < FILE_SIZE) as boolean;
      if (!isLessThan) {
        this.toast.warning('common.maxFileSize', { size: FILE_SIZE });
        observer.complete();
        return;
      }
      this.files = [file];
      observer.next(isFileAccept && isLessThan);
      observer.complete();
    });

  onSubmit(): void {
    this.resultStatus = false;
    if (!this.typeDownload) {
      this.close();
    } else {
      this.import();
    }
  }
  close() {
    this.modalRef.close({
      success: true,
      value: this.files,
    });
  }
  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: null,
    });
  }

  handleCustomUploadReq = (item: any) => {
    return of(item).subscribe(
      (next) => {
        if (isDevMode()) {
        }
      },
      (err) => {
        if (isDevMode()) {
        }
      }
    );
  };

  filesAccept(): void {
    if (this.acceptTypeFiles.includes('default')) {
      this.acceptFiles = this.typeFiles.map((file) => file.value);
    } else {
      this.acceptFiles = this.typeFiles
        .filter((file) => this.acceptTypeFiles.includes(file.type))
        .map((val) => val.value);
    }
  }

  valid(files: any) {
    return files.filter(
      (file: any) =>
        this.acceptFiles.includes(file?.type) && file?.size <= MAX_FILE_SIZE
    );
  }
  // Dowload template

  downloadTemplate(): void {
    this.loading = true;
    switch (this.typeDownload.toUpperCase()) {
      case 'USER':
        this.downloadFile(
          this.userService.dowloadTemplateImport,
          this.userService
        );
        break;
      default:
        break;
    }
  }

  downloadFile(dowloadTemplateImport: any, context: any) {
    dowloadTemplateImport.call(context, this.loading).subscribe(
      (response: any) => {
        const headers = response.headers;
        let filename = headers.get('content-disposition')?.split('filename=');
        filename =
          filename.length > 1
            ? filename[1]
            : `${Date.now().toLocaleString()}_import_${this.typeDownload.toLowerCase()}.xlsx`;
        CommonUtil.downloadFileType(
          response.body,
          response.body.type,
          filename
        );
        this.loading = false;
        this.toast.success(
          `model.${this.typeDownload.toLowerCase()}.success.download`
        );
      },
      (error: any) => {
        this.loading = false;
        this.toast.error(
          `model.${this.typeDownload.toLowerCase()}.error.download`
        );
      }
    );
  }

  // Upload File
  getFiles(files: any): void {
    this.files = files;
  }

  import(): void {
    this.loading = true;
    switch (this.typeDownload.toUpperCase()) {
      case 'USER':
        this.importFile(this.userService.import, this.userService);
        break;
      default:
        break;
    }
  }

  importFile(importUser: any, context: any) {
    this.resultStatus = false;
    const file = this.files[0];
    importUser.call(context, file, this.loading).subscribe(
      (response: any) => {
        this.loading = false;
        const headers = response.headers;
        const filename = headers.get('content-disposition')?.split('filename=');
        this.fileResultName = filename
          ? filename[1]
          : `${Date.now().toLocaleString()}_result_${this.typeDownload.toLowerCase()}.xlsx`;
        this.urlResultFile = window.URL.createObjectURL(
          new Blob([response.body], {
            type: response.body.type,
          })
        );
        const statusResult = headers.get('status');
        if (statusResult === 'true') {
          this.resultStatus = false;
          this.toast.success(
            `model.${this.typeDownload.toLowerCase()}.success.import`
          );
        } else {
          this.resultStatus = true;
          this.toast.error(
            `model.${this.typeDownload.toLowerCase()}.error.import`
          );
        }
        // this.close();
      },
      (error: any) => {
        this.loading = false;
        this.resultStatus = false;
        this.fileResultName = '';
        this.toast.error(
          `model.${this.typeDownload.toLowerCase()}.error.import`
        );
      }
    );
  }

  downloadResult() {
    if (this.urlResultFile) {
      const link = document.createElement('a');
      link.href = this.urlResultFile;
      link.download = this.fileResultName;
      document.body.appendChild(link);
      link.click();
    } else {
      this.toast.error(
        `model.${this.typeDownload.toLowerCase()}.error.download`
      );
    }
  }
}
