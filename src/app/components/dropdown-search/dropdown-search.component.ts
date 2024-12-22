import {
  Component,
  ElementRef,
  EventEmitter, forwardRef,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";

type Data<T = any> = {
  id: number;
} & T;

@Component({
  selector: 'app-dropdown-search',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './dropdown-search.component.html',
  styleUrl: './dropdown-search.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownSearchComponent),
      multi: true
    }
  ]
})
export class DropdownSearchComponent implements OnInit, ControlValueAccessor {
  public search = '';
  public isParentListAvailable = false;
  public isSearchModeActive = true;

  writeValue(search: string): void {
    this.search = search;
    if (search) {
      this.isSearchModeActive = false;
    };
  }
  onChange(value: any){};
  onTouched(){};

  @Input() searchDataList: Array<Data> = []; // <li> DATA
  @Input() listKeys: string[] = []; // for list <li> view [ NAME + PartNumber ]
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

  constructor() {}

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

  selectItem(item: Data) {
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

  // Registers a change handler that is called when the form control value changes
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registers a touched handler
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Disables or enables the control
  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state
  }
}
