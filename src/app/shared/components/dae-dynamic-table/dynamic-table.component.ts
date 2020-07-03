import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ColumnConfig } from './column-config.model';
import { ColumnFilterService } from './table-cell/cell-types/column-filter.service';
import { Observable, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { ColumnsSelectComponent } from './dialogs/columns-select/columns-select.component';
import { FilteredDataSource } from './datasource/filtered-datasource';
import { DynamicFormDialogComponent } from '../dae-dynamic-form/dialog/dynamic-form-dialog.component';
import { QuestionService } from '../dae-dynamic-form/question/question.service';
import { QuestionBase } from '../dae-dynamic-form/question/question-base';
import { MatConfirmDialogComponent } from '../mat-confirm-dialog/mat-confirm-dialog.component';
import { ColumnFilter } from './dynamic-table.model';
import { DaeOverlaySpinnerService } from '../dae-overlay-spinner/dae-overlay-spinner.service';
import { SelectionModel } from '@angular/cdk/collections';

export interface localStorageFilters {
  [key: string]: filter[]
}

export interface filter {
  key: any;
  value: any;
}

@Component({
  selector: 'dae-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent implements OnInit {

  @Input() title: string;
  @Input() columns$: Observable<ColumnConfig[]>;
  @Input() dataSource$: Observable<FilteredDataSource<any>>;
  @Input() showFilters: boolean = true;
  @Input() modifyEnabled: boolean = false;
  @Input() deleteEnabled: boolean = false;
  @Input() displaySearchField: boolean = true;
  @Input() selectionEnabled: boolean = false;
  @Input() pageSize = 20;
  @Input() pageSizeOptions = [20, 50, 100];
  @Input() paginator: MatPaginator;
  @Output() rowClick = new EventEmitter<any>();
  @Output() addElement = new EventEmitter<any>();
  @Output() modifyElement = new EventEmitter<any>();
  @Output() deleteElement = new EventEmitter<any>();
  
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[];
  columns: ColumnConfig[] = [];
  dataSource: FilteredDataSource<any>;
  searchModel: string;
  titleBadge: number = 0;
  localStorageFiltersItem: string = `filters:${window.location.pathname}`;

  @ViewChild(MatSort) private sort: MatSort;
  @ViewChild(MatPaginator) private internalPaginator: MatPaginator;

  private _appliedFilters: { [key: string]: any } = {};
  private _storedAppliedFilters: { [key: string]: { [key: string]: any }[] } = {}; 
  private _columnsSubscription: Subscription;
  private _dataSourceSubscription: Subscription;
  
  constructor(private readonly columnFilterService: ColumnFilterService, 
    private readonly _dialog: MatDialog, 
    private _elementRef: ElementRef,
    private _questionService: QuestionService,
    private _daeOverlaySpinnerService: DaeOverlaySpinnerService
  ) { }

  /**
   * Component initialization lifecycle hook
   */
  ngOnInit() {
    this._getDataSource();
    this._getColumns();
    this._setPaginator();
    this._applyLocalStorageFilters();
  }


  private _applyLocalStorageFilters() {
    const localStoredFilters = localStorage.getItem(this.localStorageFiltersItem);
    if (!!localStoredFilters ){
      const parsedStoredFilters = JSON.parse(localStoredFilters) as localStorageFilters;
      Object.keys(parsedStoredFilters).forEach(filterType => {
        const typedFiltersToApply = parsedStoredFilters[filterType];
        typedFiltersToApply.forEach(typedFilter => {
          let storedFilterComponent = this.columnFilterService.getFilter(filterType);
          let finalFilter = storedFilterComponent.prototype.getFilter(typedFilter.key);
          finalFilter.value = typedFilter.value.value;
          this._appliedFilters[typedFilter.key] = finalFilter;
        });
      });
      this.updateDataSource();
    }
  }

  /**
   * Retrieve datasource observable from component input to set
   * the sort and paginator to.
   */
  private _getDataSource() {
    const progressRef = this._daeOverlaySpinnerService.showProgress(this._elementRef);
    this._dataSourceSubscription = this.dataSource$.pipe(
      map((datasource) => 
        this._mapDataSource(datasource)))
    .subscribe(() =>
      this._daeOverlaySpinnerService.detach(progressRef));
  }

  /**
   * Map the received observable from the datasource to the local one
   * and setup sorting and pagination.
   * @param datasource Datasource from observable.
   */
  private _mapDataSource(datasource: FilteredDataSource<any>) {
    this.dataSource = datasource;
    (this.dataSource as any).sort = this.sort;
    (this.dataSource as any).paginator = this.paginator;
    this.titleBadge = this.dataSource.filteredData.length;
  }

  /**
   * Setup the component paginator
   */
  private _setPaginator() {
    if (this.paginator === undefined)
      this.paginator = this.internalPaginator;
  }

  /**
   * Retrieve columns observable from component input to set
   * the columns names and displayed columns.
   */
  private _getColumns() {
    this._columnsSubscription = this.columns$.pipe(
      map((columns) => 
        this._mapColumns(columns)))
    .subscribe();
  }

  /**
   * Map the received columns from the observable and setup
   * the displayed columns for the material table.
   * @param columns Array of columns from data schema.
   */
  private _mapColumns(columns: ColumnConfig[]) {
    this.columns = columns;
    this._setSelectColumn(columns);
    this._setOptionsColumn(columns);
    this.columns.forEach((column, index) => column.name = this._prepareColumnName(column.name, index));
    this.displayedColumns = this.columns.map((column, index) => column.name);
  }

  /**
   * Insert the selection column in front of the row
   * @param columns Data columns definition.
   */
  private _setSelectColumn(columns: ColumnConfig[]) {
    if (this.selectionEnabled) {
      let selectColumn = new ColumnConfig();
      selectColumn = { name: "select", _class: 'select' };
      this.columns.splice(0, 0, selectColumn); 
    }
  }

  /**
   * Adds the options cell if needed.
   */
  private _setOptionsColumn(columns: ColumnConfig[]) {
    if ( this.modifyEnabled || this.deleteEnabled ) {
      let optionsColumn = new ColumnConfig();
      optionsColumn = { name: "options", _class: 'options' };
      this.columns.push(optionsColumn);
    }
  }

  /**
   * Checks if component uses the internal paginator.
   */
  public isUsingInternalPaginator() {
    return this.paginator === this.internalPaginator;
  }

  /**
   * Checks if the column type can be filtered.
   * @param column The column to check the filter for.
   */
  public canFilter(column: ColumnConfig) {
    const filter = this.columnFilterService.getFilter(column._class);
    return filter != null;
  }

  /**
   * Checks if columns is already filtered and return the
   * filter value if this is the case.
   * @param column 
   */
  public isFiltered(column: ColumnConfig) {
    return this._appliedFilters[column.name];
  }

  /**
   * Retrieve the filter description for a given column.
   * @param column The column to get the filter description for.
   */
  public getFilterDescription(column: ColumnConfig) {
    const filter = this._appliedFilters[column.name];
    if (!filter || !filter.getDescription)
      return null;
    return filter.getDescription();
  }

  /**
   * Setup the column name if a name is set otherwise uses the index.
   */
  private _prepareColumnName(name: string | undefined, columnNumber: number) {
    return name || 'col' + columnNumber;
  }

  /**
   * Handles the column filter retrieve and filter dialog opening.
   * @param column The column to filter.
   */
  public filter(column: ColumnConfig) {
    const filter = this.columnFilterService.getFilter(column._class);
    if (filter) {
      const columnFilter = new ColumnFilter();
      columnFilter.column = column;
      if (this._appliedFilters[column.name])
        columnFilter.filter = Object.create(this._appliedFilters[column.name]);
      this._openFilterDialog(columnFilter, filter, column);
    }
  }

  /**
   * Opens the modal dialog for a column filter.
   * @param columnFilter The column filter.
   * @param filter The filter service object.
   * @param column The column to filter.
   */
  private _openFilterDialog(columnFilter: ColumnFilter, filter, column: ColumnConfig) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = columnFilter;
    const dialogRef = this._dialog.open(filter, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this._applyFilter(result, column);
      this._storeFilterToLocalStorage();
    });
  }

  /**
   * Opens the modal dialog for columns display selection.
   */
  public openColumnsSelectionModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      columns : this.columns,
      displayedColumns: this.displayedColumns
    };
    this._handleColumnsDisplaySelection(dialogConfig);
  }
  
  /**
   * Handle the columns selection modal dialog result and
   * filter displayed columns based on the result.
   * @param dialogConfig The dialog configuration.
   */
  private _handleColumnsDisplaySelection(dialogConfig: MatDialogConfig<any>) {
    const dialogRef = this._dialog.open(ColumnsSelectComponent, dialogConfig);
    dialogRef.afterClosed().pipe(
      filter((result) => !!result))
    .subscribe(result => 
      this.displayedColumns = result.selectedColumns);
  }

  /**
   * Apply the filter to the data set regarding the modal dialog action.
   * @param result Result of the modal dialog closing.
   * @param column The column to filter.
   */
  private _applyFilter(result, column) {
    if (result)
      this._appliedFilters[column.name] = result;
    else if (result === '')
      delete this._appliedFilters[column.name];
    if (result || result === '')
      this.updateDataSource();
  }

  private _storeFilterToLocalStorage() {
    const registeredFilters = this.columnFilterService.filters;
    Object.entries(this._appliedFilters).forEach(
      ([key, value]) => {
        let filterDataType = "";
        Object.keys(registeredFilters).forEach(type => {
          if (registeredFilters[type].name.includes(value.constructor.name))
            filterDataType = type;
        })
        if (!this._storedAppliedFilters[filterDataType])
          this._storedAppliedFilters[filterDataType] = [];
        const filter = { key, value };
        if (this._storedAppliedFilters[filterDataType].filter(storedFilter => storedFilter.key == filter.key).length == 0)
          this._storedAppliedFilters[filterDataType].push(filter);
        else {
          const filterIndex = this._storedAppliedFilters[filterDataType].findIndex(storedFilter => storedFilter.key == filter.key);
          this._storedAppliedFilters[filterDataType][filterIndex] = filter;
        }
      }
    );
    localStorage.setItem(this.localStorageFiltersItem, JSON.stringify(this._storedAppliedFilters));
  }

  /**
   * Clear all filter applied to the datasource.
   */
  private _clearFilters() {
    this._appliedFilters = {};
    this.updateDataSource();
  }

  /**
   * Update the datasource according to the filters applied.
   */
  protected updateDataSource() {
    const dataSource = this.dataSource as any;
    dataSource.filters = this.getFilters();
    this._updateTitleBadge(dataSource);
  }

  /**
   * Retrieve the filters applied to the datasource.
   */
  public getFilters() {
    const filters = this._appliedFilters;
    const filtersArray = Object.keys(filters).map((key) => filters[key]);
    return filtersArray;
  }

  /**
   * Retrieve the applied filter to a given column.
   * @param columnName The column to get the filter for.
   */
  public getFilter(columnName: string): any {
    const filterColumn = this._getColumnByName(columnName);
    if (!filterColumn) {
      throw Error(`Column with name '${columnName}' does not exist.`);
    }
    return this._appliedFilters[filterColumn.name];
  }

  /**
   * Set the filter for a given column.
   * @param columnName The column to set the filter for.
   * @param filter The filter to set.
   */
  public setFilter(columnName: string, filter: any) {
    const filterColumn = this._getColumnByName(columnName);
    if (!filterColumn) {
      throw Error(`Cannot set filter for a column. Column with name '${columnName}' does not exist.`);
    }
    this._appliedFilters[filterColumn.name] = filter;
    this.updateDataSource();
  }

  /**
   * Retrieve a column by its name.
   * @param columnName The column name to get the column for.
   */
  private _getColumnByName(columnName: string): ColumnConfig | undefined {
    return this.columns.find(c =>
      (c.name ? c.name.toLowerCase() : c.name) === (columnName ? columnName.toLowerCase() : columnName)
    );
  }

  /**
   * Event emitter for row click event.
   * @param row The row clicked.
   */
  public onRowClick(row: any) {
    this.rowClick.next(row);
  }

  /**
   * Event handler for table search.
   * @param filterValue The search input value
   */
  public onSearch(filterValue?: string) {
    if (!!filterValue && filterValue != '') {
        const lowerCaseFilterValue = filterValue.trim().toLowerCase();
        this.dataSource.filter = lowerCaseFilterValue;
        this._updateTitleBadge(this.dataSource);
    } else if (filterValue == '')
      this.updateDataSource();
  }

  /**
   * Update the title badge counter regarding filtered data.
   * @param dataSource The datasource to get filtered data counter from.
   */
  private _updateTitleBadge(dataSource: any) {
    this.titleBadge = dataSource.filteredData.length;
  }

  /**
   * Open add element form dialog upon add button click.
   * @param event The add button click event.
   */
  public add(event: Event) {
    this._openAddDialog();
  }

  /**
   * Map the question to the form dialog configuration object.
   * @param questions Form questions to map.
   */
  private _getDialogFormDialogConfiguration(questions: QuestionBase<any>[], title: string, mode: string) {
    return {
      width: '450px',
      data: { questions: questions,
        title: `${title} un ${this.title}`,
        mode: mode}
    };
  }

  /**
   * Open the add element form dialog component.
   */
  private _openAddDialog() {
    const mode = 'create';
    const questions = this._questionService.getQuestions(this.columns);
    const dialogRef = this._dialog.open(DynamicFormDialogComponent, 
      this._getDialogFormDialogConfiguration(questions, 'Ajouter', mode));
    dialogRef.componentInstance.add.subscribe((data) => 
      this._handleSubmittedData(data, mode));
  }

  /**
   * Open the modify element form dialog component.
   */
  private _openModifyDialog(data: any) {
    const mode = 'edit';
    const questions = this._questionService.getQuestions(this.columns, data);
    const dialogRef = this._dialog.open(DynamicFormDialogComponent, 
      this._getDialogFormDialogConfiguration(questions, 'Modifier', mode));
    dialogRef.componentInstance.edit.subscribe((data) => 
      this._handleSubmittedData(data, mode));
  }

  /**
   * Event emmitter for modifying data/
   * @param data The data to modify
   */
  public modify(data: any) {
    this._openModifyDialog(data);
  }

  /**
   * Event emmitter for deleting data/
   * @param data The data to delete
   */
  public delete(data: any) {
    let dialogOptions = this._getDeleteConfirmDialogOptions(data);
    let dialogRef = this._dialog.open(MatConfirmDialogComponent, dialogOptions)
    dialogRef.afterClosed().pipe(
      filter((result) => !!result))
    .subscribe(() => this.deleteElement.emit(data));
  }
  
  /**
   * Get the confirmation dialog options for the submitted data.
   * @param data The data to get the title for.
   */
  private _getDeleteConfirmDialogOptions(data: any) {
    const dataMessageText = !!data.name ? data.name : data._id;
    let defaultOptions = {
      width: '390px',
      data: { message: `Voulez-vous vraiment supprimer l'élément ${dataMessageText} ?` }
    };
    return defaultOptions;
  }

  /**
   * Handles the submitted data to forward only the relevant
   * one to the reference component.
   * @param data Submitted data.
   */
  private _handleSubmittedData(data: any, mode: string) {
    if (!data.type && data.type !== "submit") {
      mode == 'create' ? this.addElement.emit(data) : this.modifyElement.emit(data);
      console.log(`Save element: ${JSON.stringify(data)}`);
    }
  }

  /**
   * Event handler for clearing filters from the clear filter button
   * click.
   * @param event Clear filters button click event.
   */
  public clearFilters(event: Event) {
    this._clearFilters();
  }

  /**
   * Handle the row selection from checkbox click in SelectCellComponent.
   * @param row The table row to add to selection.
   */
  public select(row: any) {
    this.selection.toggle(row);
  }

  /** 
   * Whether the number of selected elements matches the total number of rows.
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  /** 
   * Selects all rows if they are not all selected; 
   * otherwise clear selection. 
   */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  /**
   * Component destruction lifecycle hook used to cleanup subscriptions.
   */
  public ngOnDestroy() {
    if ( !!this._columnsSubscription )
      this._columnsSubscription.unsubscribe();
    if ( !!this._dataSourceSubscription )
      this._dataSourceSubscription.unsubscribe();
  }
}
