import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MAX_FILE_SIZE } from '@shared/constants/file.constant';
import { FileService } from '@shared/services/file.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnInit {
  @Input() customSizeImg = false;
  @Input() displayButton = true;
  @Input() imageId = '';
  @Input() imageUrl = '';
  @Input() alternateImageUrl = '';
  @Input() className = '';
  @Input() disable = false;
  @Input() isShow = true;
  @Input() easyUpload = true;
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
  acceptFiles: string[] = [];
  files: NzUploadFile[] = [];

  defaultImageUrl = `assets/images/icon/avatar.png`;

  constructor(
    private fileService: FileService,
  ) {}

  ngOnInit(): void {
    this.filesAccept();
  }

  handleChange(event: any) {
    const file = event.target.files[0];
    this.files = this.valid([file]);
    this.emitter.emit(this.files);
  }

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

  getSource() {
    return this.enrichImageUrl(this.imageId, this.imageUrl, this.alternateImageUrl);
  }

  private enrichImageUrl(imageId?: string, imageUrl?: string, alternateImageUrl?: string): string {
    // client class có thể sử dụng cả imageId hoặc imageUrl
    if (imageId && imageId !== undefined && imageUrl !== undefined) {
      if (imageId.indexOf('base64') > -1) {
        return imageId;
      }
      // id không được chứa token
      return this.fileService.viewFileResource(imageId);
    }

    if (imageUrl && imageUrl !== undefined && imageUrl !== null) {
      if (imageUrl.indexOf('api/files') > -1) {
        return this.fileService.getFileResource(imageUrl);
      } else {
        // url base64 không chấp nhận token khi hiển thị hình ảnh
        return imageUrl;
      }
    }

    if (alternateImageUrl && alternateImageUrl !== undefined && alternateImageUrl !== null) {
      if (alternateImageUrl.indexOf('api/files') > -1) {
        return this.fileService.getFileResource(alternateImageUrl)
      } else {
        // url base64 không chấp nhận token khi hiển thị hình ảnh
        return alternateImageUrl;
      }
    }

    return this.fileService.getFileResource(this.defaultImageUrl);
  }

  getSourceAvatar() {
    return `assets/images/button/camera.png`;
  }
}
