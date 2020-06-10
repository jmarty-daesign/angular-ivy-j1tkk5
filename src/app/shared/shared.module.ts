import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MaterialModule } from "./material.module"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { DynamicTableModule } from "./components/dae-dynamic-table/dynamic-table.module"
import { DaeDatatableHeaderModule } from "./components/dae-datatable-header/dae-datatable-header.module";
import { DynamicFormModule } from "./components/dae-dynamic-form/dynamic-form.module";
import { DaeOverlaySpinnerModule } from "./components/dae-overlay-spinner/dae-overlay-spinner.module";

@NgModule({
    imports: [
        CommonModule, 
        FormsModule, 
        ReactiveFormsModule, 
        MaterialModule,
        DynamicTableModule, 
        DaeDatatableHeaderModule, 
        DynamicFormModule,
        DaeOverlaySpinnerModule
    ],
    declarations: [
    ],
    exports: [
        DaeDatatableHeaderModule,
        DynamicTableModule,
        DynamicFormModule,
        DaeOverlaySpinnerModule,
        MaterialModule
    ]
})
export class SharedModule {}
