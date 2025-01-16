import {
  Component, ElementRef,
  EventEmitter, forwardRef,
  HostListener,
  Input,
  OnInit,
  Output, ViewChild, ViewContainerRef
} from '@angular/core';

import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {OverlayModule} from '@angular/cdk/overlay';
import {DDPortalManagerService} from "../../services/dd-portal-manager.service";
import {ParseItemListKeyPipe} from "../../pipes/parse-item-list-key.pipe";

interface Data {
  id: number | string;
  name: string;
}

@Component({
  selector: 'app-dropdown-multi',
  standalone: true,
  imports: [FormsModule, OverlayModule, ParseItemListKeyPipe],
  templateUrl: './dropdown-multi.component.html',
  styleUrl: './dropdown-multi.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownMultiComponent),
      multi: true
    },
  ]
})
export class DropdownMultiComponent implements OnInit, ControlValueAccessor {
  values: Data[] = [];
  isListAvailable = false;
  availableItems: Data[] = [];
  itemsCache: Data[] = [];
  search = '';

  @ViewChild('trigger', { static: true, read: ElementRef }) trigger!: ElementRef<HTMLElement>;
  @ViewChild('dropdownTemplate') dropdownTemplate!: any;

  @Input() default: {id: number, name: string} | any = null;
  // @Input() set default(value: Data) {
  //   this.values.push(value);
  // };
  @Input() set dataList(value: Data[]) {
    this.availableItems = [...value];
    this.itemsCache = [...value];
  };
  @Input() listKeys: string[] = []; // [listKeys]="['partNumber', 'description']"
  @Input() label: string = '';
  @Input() LabelClass: string = 'block text-sm font-medium text-gray-900';

  @Output() selectedItem = new EventEmitter();

  constructor(private ddPortalManagerService: DDPortalManagerService, private viewContainerRef: ViewContainerRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Close dropdown if clicked outside
    if (!this.isListAvailable) {
      return;
    }

    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown') && !target.closest('.dropdown-content')) {
      this.isListAvailable = false;
      this.closeOverlay();
    }
  }

  // not my
  writeValue(value: Data[]): void {
    if (Array.isArray(value) && value.length > 0) {
      this.values = [...value];
    } else {
      this.values = [];
    }
  }
  onChange(value: any){};
  onTouched(){};

  closeOverlay() {
    this.ddPortalManagerService.detach();
  }

  ngOnInit() {
    if (this.default) {
      this.selectItem(this.default);
    }
  }

  selectItem(item: Data) {
    this.values.push(item);
    this.onChange(this.values.map(value => value.name));
    this.selectedItem.emit(this.values);
    this.isListAvailable = false;
    this.availableItems = this.availableItems.filter(value => value !== item);
    this.ddPortalManagerService.detach();
  }

  toggleChoice() {
    if (this.values.length === 0) { // parent form have reset
      this.availableItems = [...this.itemsCache];
    }

    this.isListAvailable = !this.isListAvailable;
    this.ddPortalManagerService.managePortal(this.trigger, this.dropdownTemplate, this.viewContainerRef);
  }

  unselect(value: any, indexToRemove: number) {
    this.values.splice(indexToRemove, 1);
    this.onChange(this.values.map(value => value.name));
    this.selectedItem.emit(this.values);
    this.availableItems.push(value);
  }

  searchItem(){
    this.availableItems = this.itemsCache.filter(item => {
      return item.name.includes(this.search) || item.name.toLowerCase().includes(this.search.toLowerCase());
    }).filter(item => !this.values.includes(item));
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Disables or enables the control
  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state
  }
}
