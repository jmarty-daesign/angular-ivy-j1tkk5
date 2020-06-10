import {Overlay, OverlayKeyboardDispatcher, OverlayPositionBuilder, ScrollStrategyOptions} from '@angular/cdk/overlay';
import {ComponentFactoryResolver, Inject, Injector, NgZone, Renderer2, RendererFactory2, ApplicationRef, Injectable} from '@angular/core';
import {DynamicOverlayContainer} from './dynamic-overlay-container.service';
import {DOCUMENT} from '@angular/common';

@Injectable()
export class DynamicOverlay extends Overlay {

  private readonly _dynamicOverlayContainer: DynamicOverlayContainer;
  private renderer: Renderer2;

  constructor(scrollStrategies: ScrollStrategyOptions,
              _overlayContainer: DynamicOverlayContainer,
              _componentFactoryResolver: ComponentFactoryResolver,
              _positionBuilder: OverlayPositionBuilder,
              _keyboardDispatcher: OverlayKeyboardDispatcher,
              _injector: Injector, 
              _applicationReference: ApplicationRef,
              _ngZone: NgZone,
              @Inject(DOCUMENT) _document: any,
              rendererFactory: RendererFactory2) {

    super(scrollStrategies, _overlayContainer, _componentFactoryResolver, _positionBuilder, _keyboardDispatcher, _applicationReference, _injector, _ngZone, _document);
    this.renderer = rendererFactory.createRenderer(null, null);
    this._dynamicOverlayContainer = _overlayContainer;
  }

  /**
   * Set the reference to the HTML container element.
   * @param containerElement The HTML container element
   */
  public setContainerElement(containerElement: HTMLElement): void {
    this.renderer.setStyle(containerElement, 'transform', 'translateZ(0)');
    this._dynamicOverlayContainer.setContainerElement(containerElement);
  }
}