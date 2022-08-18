import { Component, HostListener, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { ChangePasswordComponent } from '@pages/admin/setting/user/change-password/change-password.component';
import { LANGUAGES_CONST } from '@shared/constants/base.constant';
import { INTERNAL } from '@shared/constants/customer.constants';
import { LOCAL_STORAGE } from '@shared/constants/local-session-cookies.constants';
import {
  USER_PROFILE_INTERNAL,
  USER_PROFILE_LDAP
} from '@shared/constants/user.constant';
import { INotification } from '@shared/models/notification.model';
import { Pageable } from '@shared/models/pageable.model';
import { UserPrimary } from '@shared/models/user-primary.model';
import { IUser } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth/auth.service';
import { LoadingService } from '@shared/services/helpers/loading.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { NotificationService } from '@shared/services/notification.service';
import CommonUtil from '@shared/utils/common-utils';
import { ROUTER_UTILS } from '@shared/utils/router.utils';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  visible = false;
  isCollapsed = false;
  currentUser: any;
  currentLanguage = '';
  title = '';
  isDashboard = false;
  USER_PROFILE_LDAP = USER_PROFILE_LDAP;
  USER_PROFILE_INTERNAL = USER_PROFILE_INTERNAL;
  LANGUAGES_CONST = LANGUAGES_CONST;
  VI = LANGUAGES_CONST.VI.code;
  EN = LANGUAGES_CONST.EN.code;
  listNoti: Array<INotification> = [];
  INTERNAL = INTERNAL;
  visibleMenu = false;

  newNotificationTotal = 0;

  constructor(
    public loadingService: LoadingService,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
    private localStorage: LocalStorageService,
    private modalService: NzModalService,
    private notificationService: NotificationService
  ) {
    this.currentLanguage =
      this.localStorage.retrieve(LOCAL_STORAGE.LANGUAGE) ||
      LANGUAGES_CONST.VI.code;
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {
        if (event?.snapshot?.data?.title) {
          this.title =
            event?.snapshot?.data?.title.toString() || 'common.title';
        }
        if (event?.snapshot?.url[0]?.path) {
          this.isDashboard = event?.snapshot?.url[0]?.path === 'dashboard';
        }
      }
    });
    if (this.localStorage.retrieve(LOCAL_STORAGE.PROFILE)) {
      this.getMeNotification({});
      this.loadDataCallInterval({});
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth <= 1366) {
      this.isCollapsed = true;
    }
  }

  ngOnInit(): void {
    const profile = this.localStorage.retrieve(LOCAL_STORAGE.PROFILE);
    const token = this.authService.getToken();
    if (!profile) {
      if (token) {
        this.authService.myProfile().subscribe((response) => {
          this.currentUser = response?.body?.data as IUser;
          this.localStorage.store(LOCAL_STORAGE.PROFILE, this.currentUser);
          this.authService.myAuthorities().subscribe((res) => {
            this.currentUser.userPrimary = res.body?.data as UserPrimary;
            this.localStorage.store(LOCAL_STORAGE.PROFILE, this.currentUser);
          });
        });
      } else {
        this.router.navigate([`home`]);
      }
    } else {
      this.currentUser = profile;
    }
  }

  getShortName(fullName: string): string {
    if (!fullName) {
      return 'User Name';
    }
    const list = fullName.split(' ');
    if (list.length > 5) {
      return list[0] + ' ' + list[list.length - 1];
    } else {
      return fullName;
    }
  }

  openChangePasswordModal(): void {
    if (this.authService.getTokenPrivateKey()) {
      const base = CommonUtil.modalBase(
        ChangePasswordComponent,
        { user: { id: this.authService.getTokenPrivateKey() } },
        '30%'
      );
      const modal: NzModalRef = this.modalService.create(base);
      // modal.afterClose.subscribe((result) => {
      //   if (result && result?.success) {
      //
      //   }
      // });
    }
  }

  logout(): void {
    this.authService.logout().subscribe((response) => {
      this.authService.clear();
      this.router.navigate(['/home']);
      this.toast.success('model.logout.success.authenticate');
    });
  }

  notifiMeNavigate(): void {
    this.visibleMenu = false;
    this.router.navigate(['/notification/me']);
  }

  onChangeLanguage(language: string): void {
    if (this.currentLanguage !== language) {
      this.localStorage.store(LOCAL_STORAGE.LANGUAGE, language);
      location.reload();
    } else {
      this.visible = false;
    }
  }

  navigateDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  getImg(img: string): string {
    // return this.currentUser.avatarFileId + '?token=' + this.authService.getToken();
    return img + '?token=' + this.authService.getToken();
  }

  toChangeProfile(): void {
    this.router.navigate([
      `${ROUTER_UTILS.setting.root}/${ROUTER_UTILS.setting.myProfile}`,
    ]);
  }

  /**
   * loadData: call noti when load page first time
   *
   * @param request any
   * @param isLoading boolean
   */
  getMeNotification(request: any): void {
    const param = {};
    this.notificationService.searchMe(param, false).subscribe(
      (response) => {
        const data = response?.body?.data as Array<INotification>;
        const page = response?.body?.page as Pageable;
        this.listNoti = data;
        this.newNotificationTotal = data.filter((item) => !item.isRead).length;
      },
      (error) => {}
    );
  }

  /**
   * loadDataCallInterval: call noti setInterval, call api 20s one time
   *
   * @param request any
   */
  loadDataCallInterval(request: any) {
    const param = {};
    const interval = setInterval(() => {
      if (!this.localStorage.retrieve(LOCAL_STORAGE.PROFILE)) {
        clearInterval(interval);
      }
      this.notificationService
        .searchMe(CommonUtil.formatParams(param), false)
        .subscribe((response) => {
          const data = response?.body?.data as Array<INotification>;
          const page = response?.body?.page as Pageable;
          this.listNoti = data;
          this.newNotificationTotal = data.filter(
            (item) => !item.isRead
          ).length;
        });
    }, 20000);
  }

  formatDate(date: any): string {
    if (!date) {
      return '-';
    }
    return moment(date).format('DD/MM/yyyy');
  }

  detailNoti(notification: INotification): void {
    this.visibleMenu = false;
    notification.isRead = true;
    const type = INTERNAL;
    this.newNotificationTotal = this.listNoti.filter((item) => !item.isRead).length;
    this.router.navigate([
      `/notification/me/${notification?.id}/detail/${type.toLowerCase()}`,
    ]);
  }
}
