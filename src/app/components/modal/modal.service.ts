import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
  TemplateRef, ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ModalComponent } from './modal.component';

@Injectable()
export class ModalService {
  private modalNotifier?: Subject<string>;
  constructor(
      public vcr: ViewContainerRef,
      @Inject(DOCUMENT) private document: Document
  ) {}

  open(content: TemplateRef<any>, options?: { size?: string; title?: string }) {
    const modalComponent = this.vcr.createComponent(ModalComponent);

    modalComponent.instance.contentTemplate = content;
    modalComponent.instance.size = options?.size;
    modalComponent.instance.title = options?.title;
    modalComponent.instance.closeEvent.subscribe(() => this.closeModal());
    modalComponent.instance.submitEvent.subscribe(() => this.submitModal());

    modalComponent.hostView.detectChanges();

    this.document.body.appendChild(modalComponent.location.nativeElement);
    this.modalNotifier = new Subject();
    return this.modalNotifier?.asObservable();
  };

  closeModal() {
    this.modalNotifier?.complete();
  }

  submitModal() {
    this.modalNotifier?.next('confirm');
    this.closeModal();
  }
}
