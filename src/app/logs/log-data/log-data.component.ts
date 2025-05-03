import {Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";
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