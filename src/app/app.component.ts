import { Component, ViewChild, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ColumnConfig } from './shared/components/dae-dynamic-table/column-config.model';
import { of } from 'rxjs/observable/of';
import { FilteredDataSource } from './shared/components/dae-dynamic-table/datasource/filtered-datasource';
import { DynamicTableComponent } from './shared/components/dae-dynamic-table/dynamic-table.component';
import { MatRipple, RippleRef, RippleState } from '@angular/material';
import { DataService } from './data.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
 
  columns$: Observable<ColumnConfig[]> = of([]);
  people$: Observable<FilteredDataSource<any>> = of(new FilteredDataSource<any>([]));
  @ViewChild(DynamicTableComponent) dataTable : DynamicTableComponent;
  @ViewChild(MatRipple) actionMenuButton: MatRipple;

  private _rippleReference: RippleRef;
  private _dataSelectionSubscription: Subscription;

  constructor( private _dataService: DataService ) { } 

  /**
   * Component initialization lifecycle hook.
   */
  ngOnInit() {
    this._getData();
    this._handleStudentsSelectionChange();
  }

  /**
   * Subscription to the table selection change event.
   */
  private _handleStudentsSelectionChange() {
    this._dataSelectionSubscription = this.dataTable.selection.onChange
    .subscribe(selection => {
      this._handleActionMenuRipple(selection);
    });
  }

  /**
   * Handles the selection action menu rippling upon selection.
   * Ripples if one or more items are selected otherwise fades out the ripple.
   * @param selection The selection model.
   */
  private _handleActionMenuRipple(selection) {
    const selectedObjects = selection.source.selected;
    if (selectedObjects.length > 0 && !this._rippleReference || this._rippleReference.state == RippleState.HIDDEN)
      this._launchRipple();
    if (selectedObjects.length == 0)
      this._rippleReference.fadeOut();
  }

  /** 
   * Shows a centered and persistent ripple on the multiselection
   * action button of the top menu.
   */
  private _launchRipple() {
    this._rippleReference = this.actionMenuButton.launch({
      persistent: true,
      centered: true
    });
  }

  /**
   * Retrieve the list of students and the service data 
   * schema for columns display and filter it based on ACLs.
   */
  private _getData(): void {
    this.people$ = this._dataService.getData().pipe(
      map((people) => new FilteredDataSource<any>(people))
    );
    this.columns$ = this._dataService.getDataSchemaColumns();
  }

  /**
   * Retrieve the selected objects from the table datasource filtered data.
   * If data is seleced with checkbox then filtered, it stays selected in 
   * background but it is not included in the selection here.
   */
  private _getSelectedObjects() {
    const selectedObjects = this.dataTable.dataSource.filteredData.filter(data => 
      this.dataTable.selection.selected.includes(data));
    return selectedObjects;
  }

  /**
   * Students table selection action 1 menu item event handler.
   * @param event The menu item click event.
   */
  public onAction1Clicked(event: Event) {
    const selectedObjects = this._getSelectedObjects();
    debugger
  }

  /**
   * Students table selection action 2 menu item event handler.
   * @param event The menu item click event.
   */
  public onAction2Clicked(event: Event) {
    const selectedObjects = this._getSelectedObjects();
    debugger
  }

  /**
   * Event handler for object add.
   * @param user The object to add.
   */
  public onAdd(object: any) {
    debugger
  }

  /**
   * Event handler for object modification.
   * @param user The object to add.
   */
  public onModify(object: any) {
    debugger
  }

  /**
   * Event handler for object deletion.
   * @param user The object to delete.
   */
  public onDelete(object: any) {
    debugger
  }

  /**
   * Component destruction lifecycle hook used to cleanup subscriptions.
   */
  ngOnDestroy() {
    if ( !!this._dataSelectionSubscription ){
      this._dataSelectionSubscription.unsubscribe();
    }
  }


}
