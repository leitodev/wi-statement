import {Component, ElementRef, HostListener, Input, OnInit, output, ViewChild, ViewContainerRef} from '@angular/core';
import {DatePipe, NgClass, NgForOf} from "@angular/common";
import {ParseItemListKeyPipe} from "../../pipes/parse-item-list-key.pipe";
import {DDPortalManagerService} from "../../services/dd-portal-manager.service";

type DateData = {
  day: number;
  month: number;
  year: number;
};

type RangeData = [DateData, DateData];
type SelectedDate = {start: string, end: string};

export interface DatePickerError {
  errorMessage: string;
}

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgClass,
    ParseItemListKeyPipe
  ],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss'
})
export class DatepickerComponent implements OnInit {
  // NEED UTC format for MAX BACK

  // dd
  @Input() label: string = '';
  @Input() LabelClass: string = 'block text-sm font-medium text-gray-900';

  datePickerError = output<DatePickerError>();
  onSelectedDate = output<SelectedDate>();

  value: string = 'select date';
  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('dropdownTemplate') dropdownTemplate!: any;
  //

  currentDay = new Date().getDate();
  currentMonth = new Date().getMonth();
  currentStateDate = new Date();
  days: {day: number, selected: boolean}[] = [];

  private currentSelectedDates: any = {
    order: []
  };
  mode: 'single' | 'range' = 'range';
  private selectedDays = 0;

  isCalendarVisible = false;
  selectedDate: SelectedDate = { start: '', end: ''};

  constructor(private ddPortalManagerService: DDPortalManagerService, private viewContainerRef: ViewContainerRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Close datepicker if clicked outside
    if (!this.isCalendarVisible) {
      return;
    }
    const target = event.target as HTMLElement;
    // first for clicked icon in dropdown, second for content parent (from #dropdownTemplate)
    if (!target.closest('.dropdown') && !target.closest('.-datepicker-container')) {
      this.isCalendarVisible = false;
      this.closeOverlay();
    }
  }

  closeOverlay() {
    this.ddPortalManagerService.detach();
  }

  ngOnInit() {
    this.generateCalendar();
  }

  toggleCalendar() {
    this.isCalendarVisible = !this.isCalendarVisible;
    this.ddPortalManagerService.managePortal(this.trigger, this.dropdownTemplate, this.viewContainerRef);
    this.checkIfRangeSelected();
  }

  checkIfRangeSelected() {
    if (this.currentSelectedDates['order'].length >= 2) {
      // clear old selection
      this.currentSelectedDates = {
        order: []
      }
      this.selectedDays = 0;
      this.generateCalendar();
    }
  }

  generateCalendar() {
    const monthDays: any = [];
    const year = this.currentStateDate.getFullYear();
    const month = this.currentStateDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // index of first day

    // day of month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const emptyDays = Array(firstDay).fill({day: 0, selected: false});

    for (let i = 1; i <= daysInMonth; i++) {
      const key = `${i}_${month+1}_${year}`;
      monthDays.push({day: i, selected: this.isSelectedByKey(key)});
    };

    this.days = [...emptyDays, ...monthDays];
  }

  changeMonth(offset: number) {
    this.currentStateDate = new Date(this.currentStateDate.setMonth(this.currentStateDate.getMonth() + offset));
    this.generateCalendar();
  }

  isSelectedByKey(key: string): boolean {
    return this.currentSelectedDates.hasOwnProperty(key);
  }

  selectDay(day: number) {
    if (day) {
      this.handleSelectionByMode(this.mode, day);
    }
  }

  handleSelectionByMode(mode: string, day: number) {
    const month = this.currentStateDate.getMonth() + 1;
    const year = this.currentStateDate.getFullYear();
    const key = `${day}_${month}_${year}`;

    if (mode === 'single') {
      this.currentSelectedDates = {order: []};
      this.currentSelectedDates[key] = {day,month,year};
      this.currentSelectedDates['order'].push({day,month,year});
      this.handleOneDaySelect(day);
    }

    if (mode === 'range' && this.selectedDays < 2) {
      this.currentSelectedDates[key] = {day,month,year};
      this.currentSelectedDates['order'].push({day,month,year});
      this.handleMultiDaySelect(day);
    }
  }

  handleOneDaySelect(day: number) {
    this.days.forEach(item => {
      item.selected = false;
      if (item.day === day) {
        item.selected = true;
      }
    });

    this.getSingleDate();
    this.closeOverlay();
  }

  handleMultiDaySelect(day: number) {

    this.days.forEach(item => {
      if (item.day === day) {
        item.selected = true;
        this.selectedDays++;
      }
    });

    if (this.selectedDays > 1) {
      this.getRangeDate();
      this.closeOverlay();
    }
  }

  validateDateRange(range: SelectedDate) {
    const startDate = new Date(range.start);
    const endDate = new Date(range.end);

    if (endDate < startDate) {
      return false;
    }

    return true;
  }

  getSingleDate() {
    const first = this.currentSelectedDates.order[0];

    this.selectedDate = {
      start: new Date(first.year, first.month - 1, first.day).toISOString(),
      end: ''
    };

    this.onSelectedDate.emit(this.selectedDate);

    this.value =  this.selectedDate.start;
  }

  getRangeDate() {
    this.selectedDate = this.convertRangeToISODate(this.currentSelectedDates.order);
    this.onSelectedDate.emit(this.selectedDate);

    if (!this.validateDateRange(this.selectedDate)) {
      this.datePickerError.emit({errorMessage: 'Invalid date range: end date is before start date'})
    };

  }

  convertRangeToISODate(rangeData: RangeData) {
    const first = rangeData[0];
    const last = rangeData[1];

    return {
      start: new Date(first.year, first.month - 1, first.day).toISOString(),
      end: new Date(last.year, last.month - 1, last.day).toISOString()
    };
  }


  toggleMode() {
    this.mode = this.mode === 'single' ? 'range' : 'single';
  }
}