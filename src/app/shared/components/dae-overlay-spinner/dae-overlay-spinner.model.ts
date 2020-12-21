import { Subscription } from "rxjs";
import { OverlayRef } from "@angular/cdk/overlay";

export declare type ProgressRef = { 
    subscription: Subscription, 
    overlayRef: OverlayRef 
};