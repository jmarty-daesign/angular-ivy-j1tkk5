import { Component, Input, EventEmitter, Output } from "@angular/core"

@Component({
    selector: "dae-datatable-header",
    styleUrls: ["./dae-datatable-header.component.scss"],
    templateUrl: "./dae-datatable-header.component.html",
})
export class DaeDatatableHeaderComponent {
    //#region PROPERTIES
    @Input() public title: string = undefined

    // Action properties
    @Input() public displayActionButton: Boolean = false
    @Input() public actionButtonIcon: string = "info"
    @Output() private actionTriggered = new EventEmitter()

    // Search properties
    @Input() public searchModel: string = ""
    @Input() public displaySearchField: Boolean = false
    @Input() public searchInputPlaceholder: string = "Search"
    @Output() private searchTriggered = new EventEmitter<string>()
    //#endregion PROPERTIES

    constructor() {}

    //#region METHODS
    public triggerActionCallback(): void {
        this.actionTriggered.emit()
    }

    public triggerSearchCallback(): void {
        this.searchTriggered.emit(this.searchModel)
    }
    //#endregion METHODS
}
