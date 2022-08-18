import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ATTENDEE_TYPE } from '@shared/constants/attendee-type.constant';
import {
  MEETING_TYPE,
  MEETING_TYPES, OFFLINE
} from '@shared/constants/meeting.constants';
import { ROOM_STATUSS } from '@shared/constants/room.constants';
import { IMeetingAttendee } from '@shared/models/meeting-attendee.model';
import { IMeeting } from '@shared/models/meeting.model';
import { IRoom } from '@shared/models/room.model';
import { IUser } from '@shared/models/user.model';
import { FileService } from '@shared/services/file.service';
import { MeetingService } from '@shared/services/meeting.service';
import { RoomService } from '@shared/services/room.service';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';

@Component({
    selector: 'app-meeting-update',
    templateUrl: './detail-meeting-list.component.html',
  })
export class DetailMeetingListComponent implements OnInit {
  columns: number = 3;
  id = '';
  action = '';
  meeting: IMeeting = {};
  pathTranslate = 'model.meeting.';
  startTime = '';
  finishTime = '';
  requiredUsers: IUser[] = [];
  optionalUsers: IUser[] = [];
  presiders: IUser[] = [];
  rooms: IRoom[] = [];
  meetingTypes = MEETING_TYPE;
  meetingType = OFFLINE;
  MEETING_TYPES = MEETING_TYPES;

  constructor(
    private translateService: TranslateService,
    private roomService: RoomService,
    private meetingService: MeetingService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService
  ) {
    this.activatedRoute.data.subscribe((res) => {
      this.action = res.action;
    });
    this.activatedRoute.paramMap.subscribe((res) => {
      this.id = res.get('id') || '';
    });
  }

  ngOnInit(): void {
    this.initData();
    if (!!this.id) {
      this.initMeeting(this.id);
    }
  }

  initMeeting(id: string): void {
    this.meetingService.findByMeetingId(id, true).subscribe((response: any) => {
      this.meeting = response.body?.data;
      if (this.meeting.meetingAttendees !== undefined && this.meeting.meetingAttendees.length > 0) {
        this.handerAttendeeToForm(this.meeting.meetingAttendees);
      }
      if (this.meeting.presiderId) {
        this.handlePresierToForm(this.meeting.presiderId);
      }
    });
  }

  handlePresierToForm(presiderId: string): void {
    this.userService.find(presiderId).subscribe(
      (response: any) => {
         const presider = response?.body.data;
         this.presiders = [];
         this.presiders.push(presider);
      }
    );
  }

  initData(): void {
    this.loadDataUsers();
    this.loadDataRooms(true);
  }

  loadDataUsers(): void {
    this.userService.searchUsersAutoComplete().subscribe(
      (response: any) => {
        const data = response?.body?.data;
        this.requiredUsers = data;
        this.optionalUsers = data;
        this.presiders = data;
      }
    );
  }

  loadDataRooms(isLoading = false): void {
    const options = {
      status: ROOM_STATUSS.ACTIVE
    };
    this.roomService.searchAutoComplete(options, isLoading)
    .subscribe(
      (response: any) => {
        const data = response?.body?.data;
        this.rooms = data;
      }
    );
  }

  getTranslate(str: string): string {
    return this.translateService.instant(this.pathTranslate + '' + str);
  }

  getTitle(): string {
      return this.getTranslate('detail');
  }

  handerAttendeeToForm(meetingAttendees: IMeetingAttendee[]): void {
    const requiredUserIds: string[] = [];
    const optionalUserIds: string[] = [];
    for (const meetingAttendee of meetingAttendees) {
      if (meetingAttendee?.attendeeType === ATTENDEE_TYPE.REQUIRED) {
        if (meetingAttendee.userId !== undefined) {
          requiredUserIds.push(meetingAttendee.userId);
        }
      }
      if (meetingAttendee?.attendeeType === ATTENDEE_TYPE.OPTIONAL) {
        if (meetingAttendee.userId !== undefined) {
          optionalUserIds.push(meetingAttendee.userId);
        }
      }
    }
    if (requiredUserIds.length !== 0) {
      this.userService.findByUserIds(requiredUserIds).subscribe(
        (response: any) => {
          this.requiredUsers = response?.body.data;
        }
      );
    }
    if (optionalUserIds.length !== 0) {
      this.userService.findByUserIds(optionalUserIds).subscribe(
        (response: any) => {
          this.optionalUsers = response?.body.data;
        }
      );
    }
    this.optionalUsers = [];
  }

  findMeetingType(value: any[], id: string) {
    return value.find(it => it.value === id)?.label;
  }

  findRoomByRoomId(value: any[], roomId: string) {
    return value.find(it => it.id === roomId)?.location;
  }

  getFirstLetter(name: string): string {
    return name.charAt(0).toLocaleUpperCase().toString();
  }

  getResource(avatarFileUrl: string): string {
    return this.fileService.getFileResource(avatarFileUrl);
  }

  getLimitLength(text: string, num?: number): string {
    return CommonUtil.getLimitLength(text, num ? num : 25);
  }
}

