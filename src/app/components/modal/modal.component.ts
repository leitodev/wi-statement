import {Component, ElementRef, EventEmitter, Input, OnDestroy, Output, TemplateRef,} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnDestroy {
  modalSizeClass: {[key: string]: string} = {
    'sm': 'w-1/4',
    'md': 'w-1/2',
    'lg': 'w-4/5',
  };

  isInnerBackdropActive = false;

  @Input() contentTemplate!: TemplateRef<any>;
  @Input() size: string = 'md';
  @Input() title?: string = 'Modal title';
  @Input() data? = null;

  @Output() closeEvent = new EventEmitter();
  @Output() submitEvent = new EventEmitter();

  constructor(private elementRef: ElementRef) {
  }

  close(): void {
    this.elementRef.nativeElement.remove();
    this.closeEvent.emit();
  }

  closeBackdrop() {
    this.isInnerBackdropActive = false;
  };

  // submit(): void {
  //   this.elementRef.nativeElement.remove();
  //   this.submitEvent.emit();
  // }

  ngOnDestroy(){}
}
