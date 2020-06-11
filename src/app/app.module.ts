import { SharedModule } from "./shared/shared.module";
import { NgModule, LOCALE_ID } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DataService } from "./data.service";
import { MatDialogModule } from '@angular/material';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from "@angular/common";
registerLocaleData(localeFr);

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        MatDialogModule
    ],
    providers: [
      DataService,
      { provide: LOCALE_ID, useValue: 'fr-FR'}
    ],
    bootstrap: [
      AppComponent
    ],
})
export class AppModule {
    constructor() {
    }
}
