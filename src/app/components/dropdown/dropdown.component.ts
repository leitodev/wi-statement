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

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [FormsModule, OverlayModule, ParseItemListKeyPipe],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements OnInit {
  value: string = '';
  listAvailable = false;
  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('dropdownTemplate') dropdownTemplate!: any;

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

  selectItem(item: { id: number, name: string }) {
    this.selectedItem.emit(item);
    this.value = item.name;
    this.listAvailable = false;

    this.ddPortalManagerService.detach();
  }

  toggleChoice() {
    this.listAvailable = !this.listAvailable;
    this.ddPortalManagerService.managePortal(this.trigger, this.dropdownTemplate, this.viewContainerRef);
  };

  onMouseLeaveContent() {
    if (this.closeIfLeaveContent) {
      this.closeOverlay();
    }
  }
}
