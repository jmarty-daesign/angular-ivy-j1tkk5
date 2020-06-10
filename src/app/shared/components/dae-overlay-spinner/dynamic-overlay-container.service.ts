import {OverlayContainer} from '@angular/cdk/overlay';
import {Injectable} from '@angular/core';

@Injectable()
export class DynamicOverlayContainer extends OverlayContainer {

  /**
   * Set the reference to the HTML container element.
   * @param containerElement The HTML container element
   */
  public setContainerElement(containerElement: HTMLElement): void {
    this._containerElement = containerElement;
  }
}