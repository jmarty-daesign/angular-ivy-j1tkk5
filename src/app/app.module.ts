import { SharedModule } from "./shared/shared.module";
import { NgModule, LOCALE_ID } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DataService } from "./data.service";
import { MatDialogModule } from '@angular/material';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { DynamicTableModule } from "./shared/components/dae-dynamic-table/dynamic-table.module";
import { DaeDatatableHeaderModule } from "./shared/components/dae-datatable-header/dae-datatable-header.module";
import { DaeOverlaySpinnerModule } from "./shared/components/dae-overlay-spinner/dae-overlay-spinner.module";
import { DynamicFormModule } from "./shared/components/dae-dynamic-form/dynamic-form.module";
registerLocaleData(localeFr);

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,        
        DynamicTableModule,
        DaeDatatableHeaderModule, 
        DynamicFormModule,
        DaeOverlaySpinnerModule,
        MatDialogModule,
        TranslateModule.forRoot()
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
