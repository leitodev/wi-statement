import {ElementRef, Injectable, ViewContainerRef} from '@angular/core';
import {TemplatePortal} from "@angular/cdk/portal";
import {Overlay, OverlayRef} from "@angular/cdk/overlay";

@Injectable({
  providedIn: 'root',
})
export class DDPortalManagerService {
  overlayRef!: OverlayRef;
  constructor(private overlay: Overlay) { }

  detach() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null!;
    }
  };

  managePortal(trigger: ElementRef, dropdownTemplate: any, viewContainerRef: ViewContainerRef) {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null!;
      return;
    }

    const triggerWidth = trigger.nativeElement.offsetWidth;
    const triggerElement = trigger.nativeElement;
    const triggerRect = triggerElement.getBoundingClientRect(); // Get trigger position relative to the viewport
    const scrollY = window.scrollY || document.documentElement.scrollTop; // Get page scroll offset
    const triggerBottom = triggerRect.bottom + scrollY; // Calculate trigger's bottom position in the page

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(trigger.nativeElement)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 1, // Add vertical offset
        },
      ])
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withPush(false);

    // Dynamically set `offsetY` based on the scroll position
    positionStrategy.positionChanges.subscribe(() => {
      const newOffsetY = triggerBottom - window.scrollY;
      positionStrategy.withDefaultOffsetY(newOffsetY);
    });

    this.overlayRef = this.overlay.create({
      positionStrategy,
      minWidth: `${triggerWidth}px`,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop', // Optional: Click backdrop to close
    });

    const portal = new TemplatePortal(dropdownTemplate, viewContainerRef);
    this.overlayRef.attach(portal);

    const overlayContainer = document.querySelector('.cdk-overlay-container') as HTMLElement;
    overlayContainer.style.position = 'absolute';

    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef?.detach();
      this.overlayRef = null!;
    });

    this.overlayRef.detachments().subscribe(() => {
      overlayContainer.style.position = 'initial';
      this.overlayRef = null!;
    });
  }
}
