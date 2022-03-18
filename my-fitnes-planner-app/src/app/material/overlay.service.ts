import {
  Overlay,
  OverlayRef,
  OverlayConfig,
  PositionStrategy,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  constructor(private overlay: Overlay) {}
  /**
   *
   * @param config
   * @returns
   */
  createOverlay(config: OverlayConfig): OverlayRef {
    return this.overlay.create(config);
  }
  /**
   *
   * @param overlayRef
   * @param templateRef
   * @param vcRef
   */
  attachTemplatePortal(
    overlayRef: OverlayRef,
    templateRef: TemplateRef<any>,
    vcRef: ViewContainerRef
  ) {
    let templatePortal = new TemplatePortal(templateRef, vcRef);
    overlayRef.attach(templatePortal);
  }
  /**
   *
   * @returns PositionStrategy
   */
  positionGloballyCenter(): PositionStrategy {
    return this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();
  }
}
