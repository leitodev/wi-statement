import {
  Component, ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output, ViewChild, ViewContainerRef
} from '@angular/core';

import {FormsModule} from "@angular/forms";
import {OverlayModule} from '@angular/cdk/overlay';
import {DDPortalManagerService} from "../../services/dd-portal-manager.service";
import {ParseItemListKeyPipe} from "../../pipes/parse-item-list-key.pipe";

interface Data {
  id: number;
  name: string;
}

@Component({
  selector: 'app-dropdown-multi',
  standalone: true,
  imports: [FormsModule, OverlayModule, ParseItemListKeyPipe],
  templateUrl: './dropdown-multi.component.html',
  styleUrl: './dropdown-multi.component.scss'
})
export class DropdownMultiComponent implements OnInit {
  values: Data[] = [];
  isListAvailable = false;
  availableItems: Data[] = [];
  availableItemsBeforeSearch: Data[] = [];
  search = '';

  @ViewChild('trigger', { static: true, read: ElementRef }) trigger!: ElementRef<HTMLElement>;
  @ViewChild('dropdownTemplate') dropdownTemplate!: any;

  @Input() default: {id: number, name: string} | any = null;
  @Input() set dataList(value: Data[]) {
    this.availableItems = [...value];
    this.availableItemsBeforeSearch = [...value];
  };
  @Input() listKeys: string[] = [];
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

  closeOverlay() {
    this.ddPortalManagerService.detach();
  }

  ngOnInit() {
    if (this.default) {
      this.selectItem(this.default);
    }
  }

  selectItem(item: { id: number, name: string }) {
    this.values.push(item);
    this.selectedItem.emit(this.values);
    this.isListAvailable = false;
    this.availableItems = this.availableItems.filter(value => value !== item);
    this.ddPortalManagerService.detach();
  }

  toggleChoice() {
    this.isListAvailable = !this.isListAvailable;
    this.ddPortalManagerService.managePortal(this.trigger, this.dropdownTemplate, this.viewContainerRef);
  }

  unselect(value: any, indexToRemove: number) {
    this.values.splice(indexToRemove, 1);
    this.selectedItem.emit(this.values);
    this.availableItems.push(value);
  }

  searchItem(){
    this.availableItems = this.availableItemsBeforeSearch.filter(item => {
      return item.name.includes(this.search) || item.name.toLowerCase().includes(this.search.toLowerCase());
    }).filter(item => !this.values.includes(item));
  }
}
