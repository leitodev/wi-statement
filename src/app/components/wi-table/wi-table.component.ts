import { Component } from '@angular/core';
import {CommonModule, NgIf} from "@angular/common";

@Component({
  selector: 'wi-table',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './wi-table.component.html',
  styleUrl: './wi-table.component.scss'
})
export class WiTableComponent {

  tableConfig = {
    headers: [
      {name: 'id', sort: true},
      {name: 'supplier', sort: true},
      {name: 'part_number', sort: false},
      {name: 'components', sort: false},
      {name: 'description', sort: false},
    ],
    data: [
      {
        id: 1,
        supplier: 'Rockstar Games',
        part_number: '123SU152',
        components: [
          {id: 132, name: 'rohs'},
          {id: 232, name: 'lolipop'}
        ],
        description: 'lorem text'
      }
    ]
  }



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
