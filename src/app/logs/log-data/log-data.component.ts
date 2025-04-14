import {Component, Input} from '@angular/core';
import {JsonPipe, KeyValuePipe, NgClass, NgStyle} from "@angular/common";
import {CellColor} from "../../components/wi-table/wi-table.component";

@Component({
  selector: 'app-log-data',
  standalone: true,
  imports: [
    NgClass,
  ],
  templateUrl: './log-data.component.html',
  styleUrl: './log-data.component.scss'
})
export class LogDataComponent {
  @Input() data: any;

  ngOnInit() {
  }
}