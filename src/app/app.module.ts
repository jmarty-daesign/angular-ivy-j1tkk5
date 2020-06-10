import { SharedModule } from "./shared/shared.module";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DataService } from "./data.service";


@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule
    ],
    entryComponents: [AppComponent],
    providers: [DataService],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor() {
    }
}
