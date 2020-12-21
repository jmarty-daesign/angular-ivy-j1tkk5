import { ElementRef, Injectable } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { DynamicOverlay } from './dynamic-overlay.service';
import { DaeOverlaySpinnerComponent } from './dae-overlay-spinner.component';
import { timer } from 'rxjs/observable/timer';
import { ProgressRef } from './dae-overlay-spinner.model';

@Injectable()
export class DaeOverlaySpinnerService {

  constructor(private dynamicOverlay: DynamicOverlay) { }

  /**
   * Create the overlay spinner component and subscribe to it.
   * @param elementRef The HTML element reference to attach the overlay to.
   */
  public showProgress(elementRef: ElementRef) {
    if (elementRef) {
      const progressReference: ProgressRef = { subscription: null, overlayRef: null };
      progressReference.subscription = timer(10)
        .subscribe(() => this._createDynamicOverlay(elementRef, progressReference));
      return progressReference;
    } else {
      return null;
    }
  }

  /**
   * Create the overlay spinner component and attach it to the HTML element.
   * @param elementRef The HTML element reference to attach the overlay to.
   * @param progressReference The progress spinner reference object.
   */
  private _createDynamicOverlay(elementRef: ElementRef, progressReference: ProgressRef) {
    this.dynamicOverlay.setContainerElement(elementRef.nativeElement);
    const positionStrategy = this.dynamicOverlay.position().global().centerHorizontally().centerVertically();
    progressReference.overlayRef = this.dynamicOverlay.create({
      positionStrategy: positionStrategy,
      hasBackdrop: true
    });
    const componentRef = progressReference.overlayRef.attach(new ComponentPortal(DaeOverlaySpinnerComponent));
  }

  /**
   * Unsubscribe to the overlay spinner component.
   * @param progressReference The progress spinner reference object.
   */
  detach(progressReference: ProgressRef) {
    if (progressReference) {
      progressReference.subscription.unsubscribe();
      if (progressReference.overlayRef) {
        progressReference.overlayRef.detach();
      }
    }
  }
}