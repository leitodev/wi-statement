import {
  Component, ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output, ViewChild, ViewContainerRef
} from '@angular/core';

import {FormsModule} from "@angular/forms";
import {Overlay, OverlayModule, OverlayRef} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {DDPortalManagerService} from "../../services/dd-portal-manager.service";

@Component({
  selector: 'app-dropdown-multi',
  standalone: true,
  imports: [FormsModule, OverlayModule],
  templateUrl: './dropdown-multi.component.html',
  styleUrl: './dropdown-multi.component.scss'
})
export class DropdownMultiComponent implements OnInit {
  value: string = '';
  listAvailable = false;
  @ViewChild('trigger', { static: true, read: ElementRef }) trigger!: ElementRef<HTMLElement>;

  @ViewChild('dropdownTemplate2') dropdownTemplate!: any;

  @Input() default: {id: number, name: string} | any = null;
  @Input() dataList: Array<{id: number, name: string}> = [];
  @Input() listKeys: string[] = [];
  @Input() label: string = '';
  @Input() closeIfLeaveContent =  false;
  @Input() LabelClass: string = 'block text-sm font-medium text-gray-900';

  @Output() selectedItem = new EventEmitter();

  constructor(private ddPortalManagerService: DDPortalManagerService, private viewContainerRef: ViewContainerRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Close dropdown if clicked outside
    if (!this.listAvailable) {
      return;
    }

    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.listAvailable = false;
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

  parseItemListKey(item: any) {
    // console.log('this data', this.dataList);
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

    this.ddPortalManagerService.detach();
  }

  toggleChoice() {
    this.listAvailable = !this.listAvailable;
    this.ddPortalManagerService.managePortal(this.trigger, this.dropdownTemplate, this.viewContainerRef);
  }

  onMouseLeaveContent() {
    if (this.closeIfLeaveContent) {
      this.closeOverlay();
    }
  }
}
