import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { DaeOverlaySpinnerComponent } from './dae-overlay-spinner.component';
import { DaeOverlaySpinnerService } from './dae-overlay-spinner.service';
import { DynamicOverlayContainer } from './dynamic-overlay-container.service';
import { DynamicOverlay } from './dynamic-overlay.service';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    OverlayModule
  ],
  declarations: [
    DaeOverlaySpinnerComponent
  ],
  exports: [
    DaeOverlaySpinnerComponent
  ],
  entryComponents: [
    DaeOverlaySpinnerComponent
  ],
  providers: [
    DaeOverlaySpinnerService,
    DynamicOverlay,
    DynamicOverlayContainer
  ]
})
export class DaeOverlaySpinnerModule {
  constructor() {
  }
}
