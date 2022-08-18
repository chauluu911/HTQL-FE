import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import CommonUtil from '@shared/utils/common-utils';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
})
export class DateRangePickerComponent implements OnInit {
  @ViewChild('fromDatePicker') startDatePicker!: NzDatePickerComponent;
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  @Input() fromDate?: Date;
  @Input() toDate?: Date;
  @Input() disabled = false;
  fromDateNumber?: number;
  toDateNumber?: number;
  fromDateActive = false;
  endDateActive = false;
  fromDateChangeTimeOut: any;
  toDateChangeTimeOut: any;
  @Output() rangeDateChange: EventEmitter<{ fromDate?: Date; toDate?: Date }> =
    new EventEmitter();
  groupActive = false;

  constructor() {
  }

  ngOnInit(): void {
    if (typeof this.fromDate === 'string') {
      this.fromDate = this.getDate(this.fromDate);
    }
    if (typeof this.toDate === 'string') {
      this.toDate = this.getDate(this.toDate);
    }
  }

  onFromDateChange(result?: Date): void {
    clearTimeout(this.fromDateChangeTimeOut);
    this.fromDateChangeTimeOut = setTimeout(() => {
      if (result) {
        this.fromDate = new Date(result);
        if (!this.toDate) {
          this.endDatePicker.setModeAndFormat();
          this.endDatePicker.open();
          this.endDatePicker.focus();
        }
      }
      // push event to form
      this.rangeDateChange.emit({
        fromDate: this.fromDate,
        toDate: this.toDate,
      });
    }, 300);
  }

  onFromDateEnter(event: any): void {
    const date = event?.target?.value;
    if (!date) {
      this.startDatePicker.setModeAndFormat();
      this.startDatePicker.close();
      this.fromDate = undefined;
      this.rangeDateChange.emit({
        fromDate: this.fromDate,
        toDate: this.toDate,
      });
      return;
    }
    if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
      this.startDatePicker.setModeAndFormat();
      this.startDatePicker.close();
      return;
    }
    // check from date > to date
    if (!!this.toDate) {
      if (CommonUtil.newDate(date).getTime() > this.toDate.getTime()) {
        this.startDatePicker.setModeAndFormat();
        this.startDatePicker.close();
        return;
      }
    }
    if (CommonUtil.newDate(date)) {
      this.fromDate = CommonUtil.newDate(date);
      this.startDatePicker.close();
      if (!this.toDate) {
        this.endDatePicker.setModeAndFormat();
        this.endDatePicker.open();
        this.endDatePicker.focus();
      }
    }
    this.rangeDateChange.emit({fromDate: this.fromDate, toDate: this.toDate});
  }

  onEndDateChange(result?: Date): void {
    clearTimeout(this.toDateChangeTimeOut);
    this.toDateChangeTimeOut = setTimeout(() => {
      if (result) {
        this.toDate = new Date(result);
      }
      // push event to
      this.rangeDateChange.emit({
        fromDate: this.fromDate,
        toDate: this.toDate,
      });
    }, 300);
  }

  onEndDateEnter(event: any): void {
    const date = event?.target?.value;
    if (!date) {
      this.endDatePicker.setModeAndFormat();
      this.endDatePicker.close();
      this.toDate = undefined;
      this.rangeDateChange.emit({
        fromDate: this.fromDate,
        toDate: this.toDate,
      });
      return;
    }
    if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
      this.endDatePicker.setModeAndFormat();
      this.endDatePicker.close();
      return;
    }
    // check from date > to date
    if (!!this.fromDate) {
      if (CommonUtil.newDate(date).getTime() < this.fromDate.getTime()) {
        this.endDatePicker.setModeAndFormat();
        this.endDatePicker.close();
        return;
      }
    }
    if (CommonUtil.newDate(date)) {
      this.toDate = CommonUtil.newDate(date);
      this.endDatePicker.close();
    }
    this.rangeDateChange.emit({fromDate: this.fromDate, toDate: this.toDate});
  }

  fromDateDisabledTime = (current: Date): boolean => {
    if (!!this.toDate) {
      return current.getTime() > this.toDate.getTime();
    }
    return false;
  };

  toDateDisabledTime = (current: Date): boolean => {
    if (!!this.fromDate) {
      return current.getTime() < this.fromDate.getTime();
    }
    return false;
  };

  onDateFocus = (active: boolean): void => {
    this.groupActive = active;
  };

  getDate(date?: string): Date | undefined {
    if (date) {
      return CommonUtil.newDate(date);
    }
    return undefined;
  }
}
