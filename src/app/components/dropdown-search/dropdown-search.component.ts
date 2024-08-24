import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-dropdown-search',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './dropdown-search.component.html',
  styleUrl: './dropdown-search.component.scss'
})
export class DropdownSearchComponent implements OnInit {
  @Input() searchDataList: Array<{id: number}> = [];
  @Input() listKeys: string[] = [];
  @Input() label: string = '';
  @Input() LabelClass: string = 'block text-sm font-medium text-gray-900';

  @Output() selectedItem = new EventEmitter();
  @Output() searchedItem = new EventEmitter();
  @Output() changeEvent = new EventEmitter();

  @ViewChild('inputRef') inputElement!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Close dropdown if clicked outside
    if (!this.isParentListAvailable) {
      return;
    }

    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown--search')) {
      this.isParentListAvailable = false;
      this.clear();
    }
  }

  public search = '';
  public isParentListAvailable = false;
  public isSearchModeActive = true;

  constructor() {
  }

  ngOnInit() {}

  parseItemListKey(item: any) {
    let values: string[] = [];

    for (let i = 0; i < this.listKeys.length; i++) {
      if (item[this.listKeys[i]]) {
        values.push(item[this.listKeys[i]]);
      };
    };

    return values.join(' - ');
  }

  selectItem(item: any) {
    this.search = this.parseItemListKey(item);
    this.selectedItem.emit(item);
    this.isParentListAvailable = false;
    this.isSearchModeActive = false;
  }

  searchItem(search: string) {
    this.isParentListAvailable = true;
    this.searchedItem.emit(search);
  };

  change() {
    this.isSearchModeActive = true;
    this.changeEvent.emit(true);
  };

  clear() {
    this.search = '';
    this.isSearchModeActive = true;
    this.inputElement.nativeElement.focus();
  }
}
