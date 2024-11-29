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

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [FormsModule, OverlayModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements OnInit {
  value: string = '';
  listAvailable = false;
  overlayRef!: OverlayRef;

  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('dropdownTemplate') dropdownTemplate!: any;

  @Input() default: {id: number, name: string} | any = null;
  @Input() dataList: Array<{id: number, name: string}> = [];
  @Input() listKeys: string[] = [];
  @Input() label: string = '';
  @Input() closeIfLeaveContent =  false;
  @Input() LabelClass: string = 'block text-sm font-medium text-gray-900';

  @Output() selectedItem = new EventEmitter();

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) {}

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
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null!;
    }
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

    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null!;
    }
  }

  toggleChoice() {
    this.listAvailable = !this.listAvailable;

    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null!;
      return;
    }
    const triggerWidth = this.trigger.nativeElement.offsetWidth;
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.trigger)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
      ]);

    this.overlayRef = this.overlay.create(
      {
        positionStrategy,
        minWidth: `${triggerWidth}px`,
        hasBackdrop: true,
      }
    );

    const portal = new TemplatePortal(this.dropdownTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);

    this.overlayRef.detachments().subscribe(() => {
      this.overlayRef = null!;
    });

  }

  onMouseLeaveContent() {
    if (this.closeIfLeaveContent) {
      this.closeOverlay();
    }
  }
}
