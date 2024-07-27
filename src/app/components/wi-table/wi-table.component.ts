import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule, NgIf} from "@angular/common";

@Component({
  selector: 'wi-table',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './wi-table.component.html',
  styleUrl: './wi-table.component.scss'
})
export class WiTableComponent {
  @Input('tableConfigData') tableConfig : any = null;
  @Input() data : any = null;

  @Output() tableEvent = new EventEmitter();

  tableRowCLick(rowItem: any){
    this.tableEvent.emit({eventName:'tableRowCLick', data: rowItem });
  };

  tableRowEditBtn(rowItem: any, event: Event){
    event.stopPropagation();
    this.tableEvent.emit({eventName:'tableRowEditBtn', data: rowItem });
  };
  /*
  items list (Id (number),
   supplier (string),
    part number (string),
     components (list of part numbers),
      description (string)),
       нужно добавить динамические поля,
        которые содержать в себе названия регулирующих актов (REACH, RoHS etc),
  */
}
