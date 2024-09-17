import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';

import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements OnInit {
  public value: string = '';

  @Input() default: {id: number, name: string} | any = null;
  @Input() dataList: Array<{id: number, name: string}> = [];
  @Input() listKeys: string[] = [];
  @Input() label: string = '';
  @Input() LabelClass: string = 'block text-sm font-medium text-gray-900';

  @Output() selectedItem = new EventEmitter();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Close dropdown if clicked outside
    if (!this.listAvailable) {
      return;
    }

    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.listAvailable = false;
    }
  }
  public listAvailable = false;

  constructor() {
  }

  ngOnInit() {
    if (this.default) {
      this.selectItem(this.default);
    }
  }

  parseItemListKey(item: any) {
    let values: string[] = [];

    for (let i = 0; i < this.listKeys.length; i++) {
      if (item[this.listKeys[i]]) {
        values.push(item[this.listKeys[i]]);
      };
    };

    return values.join(' - ');
  }

  selectItem(item: { id: number, name: string }) {
    this.selectedItem.emit(item);
    this.value = item.name;
    this.listAvailable = false;
  }

  toggleChoice() {
    this.listAvailable = !this.listAvailable;
  }
}
