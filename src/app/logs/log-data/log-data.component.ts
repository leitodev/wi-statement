import {Component, Input} from '@angular/core';
import {JsonPipe, KeyValuePipe, NgClass, NgStyle} from "@angular/common";
import {CellColor} from "../../components/wi-table/wi-table.component";

@Component({
  selector: 'app-log-data',
  standalone: true,
  imports: [
    KeyValuePipe,
    NgClass,
  ],
  templateUrl: './log-data.component.html',
  styleUrl: './log-data.component.scss'
})
export class LogDataComponent {
  @Input() changesData: any = null; // Full data with after, before and diff
  @Input() changesType: string = ''; // before/after
  @Input() currentData: any = null; // Data to output
  @Input() isAllLogsVisible: boolean = false; // Show all or difference

  ngOnInit() {

  }

  isObjectCheck(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }
  isNotEmpty(item: any): boolean {
    if (Array.isArray(item)) {
      return item.length > 0;
    } else if (item && typeof item === 'object') {
      return Object.keys(item).length > 0;
    } else if (typeof item === 'boolean') {
      return true; // treat both true and false as 'not empty'
    }
    return !!item; // string, number, etc.
  }

  toggleLogInfo(event: any, index:string){
    event.preventDefault();
    event.currentTarget.querySelector('.log-title-arrow').classList.toggle('log-title-arrow__rotated');
    let logTextClass = `.log-text__${index}`;
    document.querySelector(logTextClass)?.classList.toggle('log-text__hidden');
  }
  protected readonly Array = Array;
}