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
  hours = Array.from({ length: 12 }, (_, i) => i);
  minutes = Array.from({ length: 60 }, (_, i) => i);

  selectedHour = this.getHour();
  selectedMinute = new Date().getMinutes();
  panelOpen = false;
  amPm: 'AM' | 'PM' = 'AM';

  @ViewChild('hourContainer') hourContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('minuteContainer') minuteContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('pickerPanel') pickerPanel!: ElementRef;

  private getHour() {
    let hour = new Date().getHours();
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;
    return hour;
  }

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
    this.selectedHour =  hour;
    this.scrollToCenter(this.hourContainer.nativeElement, hour);
  }

  selectMinute(minute: number) {
    this.selectedMinute = minute;
    this.scrollToCenter(this.minuteContainer.nativeElement, minute);
  }

  get displayedHours(): number[] {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }

  setAmPm(value: 'AM' | 'PM') {
    this.amPm = value;
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


  time12ToISOString(hour: string, minute: string, mode: string) {

    const dateStr = '2025-05-17'

    let h = parseInt(hour, 10);
    const m = parseInt(minute, 10);

    // Convert 12-hour to 24-hour format
    if (mode === 'PM' && h < 12) h += 12;
    if (mode === 'AM' && h === 12) h = 0;

    // Build full date-time string in UTC (Z suffix)
    const isoString = new Date(`${dateStr}T${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00Z`).toISOString();
    return isoString;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.panelOpen && !this.pickerPanel?.nativeElement.contains(event.target)) {
      this.panelOpen = false;
      console.log('selectedHour', this.selectedHour);
      console.log('selectedMinute', this.selectedMinute);
      console.log('this.amPm', this.amPm);

      let value: any = {
        hour: this.selectedHour < 10 ? '0' + this.selectedHour : this.selectedHour.toString(),
        minute: this.selectedMinute < 10 ? '0' + this.selectedMinute : this.selectedMinute.toString(),
        mode: this.amPm,
      }
      value['iso'] = this.time12ToISOString(value.hour, value.minute, value.mode);

      console.log('selected value', value);

    }
  }
}