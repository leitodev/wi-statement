import {Component, Input} from '@angular/core';
import {CommonModule, LowerCasePipe, NgSwitch, NgSwitchCase} from "@angular/common";

@Component({
  selector: 'app-status-svg',
  standalone: true,
    imports: [
        LowerCasePipe,
        NgSwitchCase,
        NgSwitch,
        CommonModule
    ],
  templateUrl: './status-svg.component.html',
  styleUrl: './status-svg.component.scss'
})
export class StatusSvgComponent {
    @Input() complianceStatus: string = 'none';
}
