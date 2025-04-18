import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
  TemplateRef, ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ModalComponent } from './modal.component';
import {ModalTypes} from "./modal-types";

@Injectable({
    providedIn: 'root'
})
export class ModalService {
  private modalNotifier?: Subject<{ event: string, data?: any }>;
  private modalComponent: any = null;

  constructor(
      public vcr: ViewContainerRef,
      @Inject(DOCUMENT) private document: Document
  ) {}

  open(content: TemplateRef<any>, options?: { size?: string; title?: string, data?: any }) {
    this.modalComponent = this.vcr.createComponent(ModalComponent);

    this.modalComponent.instance.contentTemplate = content;
    this.modalComponent.instance.size = options?.size;
    this.modalComponent.instance.data = options?.data;
    this.modalComponent.instance.title = options?.title;
    this.modalComponent.instance.closeEvent.subscribe(() => this.closeModal());

    this.modalComponent.hostView.detectChanges();

    this.document.body.appendChild(this.modalComponent.location.nativeElement);
    this.modalNotifier = new Subject();

    document.body.classList.add('no-scroll');

    return this.modalNotifier?.asObservable();
  };

  closeModal() {
    document.body.classList.remove('no-scroll');
    this.modalNotifier?.next({
      event: ModalTypes.CLOSE
    });
    this.modalNotifier?.complete();
    this.modalComponent.destroy();
  }

  submitModal(data: any, event: ModalTypes) {
    console.log(data);
    console.log(event);
    this.modalNotifier?.next({
      event,
      data
    });
  }
}
