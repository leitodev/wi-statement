import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-timepicker',
  standalone: true,
  imports: [
    DecimalPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './timepicker.component.html',
  styleUrl: './timepicker.component.scss'
})
export class TimepickerComponent {
  hours = Array.from({ length: 24 }, (_, i) => i);
  minutes = Array.from({ length: 60 }, (_, i) => i);

  selectedHour = new Date().getHours();
  selectedMinute = new Date().getMinutes();
  is24Hour = false;
  panelOpen = false;

  @ViewChild('hourContainer') hourContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('minuteContainer') minuteContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('pickerPanel') pickerPanel!: ElementRef;

  togglePanel() {
    this.panelOpen = !this.panelOpen;

    if (this.panelOpen) {
      setTimeout(() => {
        this.scrollToCenter(this.hourContainer.nativeElement, this.selectedHour);
        this.scrollToCenter(this.minuteContainer.nativeElement, this.selectedMinute);
      }, 0);
    }
  }

  selectHour(hour: number) {
    this.selectedHour = this.is24Hour ? hour : this.convert12To24(hour, this.amPm);
    this.scrollToCenter(this.hourContainer.nativeElement, hour);
  }

  selectMinute(minute: number) {
    this.selectedMinute = minute;
    this.scrollToCenter(this.minuteContainer.nativeElement, minute);
  }

  convert12To24(hour: number, period: 'AM' | 'PM') {
    if (period === 'AM' && hour === 12) return 0;
    if (period === 'PM' && hour !== 12) return hour + 12;
    return hour;
  }

  toggleMode() {
    this.is24Hour = !this.is24Hour;
    if (this.is24Hour) {
      if (this.selectedHour === 12) this.selectedHour = 0;
      if (this.amPm === 'PM' && this.selectedHour < 12) {
        this.selectedHour += 12;
      }
    } else {
      this.selectedHour = this.selectedHour % 12 || 12;
    }
  }

  get displayedHours(): number[] {
    if (this.is24Hour) return this.hours;
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }

  get amPm(): 'AM' | 'PM' {
    return this.selectedHour >= 12 ? 'PM' : 'AM';
  }

  setAmPm(value: 'AM' | 'PM') {
    if (!this.is24Hour) {
      if (value === 'AM' && this.selectedHour >= 12) this.selectedHour -= 12;
      if (value === 'PM' && this.selectedHour < 12) this.selectedHour += 12;
    }
  }

  scrollToCenter(container: HTMLElement, value: number) {
    const children = Array.from(container.children);
    const el = children.find(child => parseInt(child.getAttribute('data-val') || '') === value);
    if (el) {
      const elOffset = (el as HTMLElement).offsetTop;
      const centerOffset = container.clientHeight / 2 - (el as HTMLElement).clientHeight / 2;
      container.scrollTo({
        top: elOffset - centerOffset,
        behavior: 'smooth'
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.panelOpen && !this.pickerPanel?.nativeElement.contains(event.target)) {
      this.panelOpen = false;
    }
  }
}