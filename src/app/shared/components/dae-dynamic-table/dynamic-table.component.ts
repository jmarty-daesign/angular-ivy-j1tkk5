import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ColumnFilterService } from './table-cell/cell-types/column-filter.service';
import { Observable, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { ColumnsSelectComponent } from './dialogs/columns-select/columns-select.component';
import { FilteredDataSource } from './datasource/filtered-datasource';
import { DynamicFormDialogComponent } from '../dae-dynamic-form/dialog/dynamic-form-dialog.component';
import { QuestionService } from '../dae-dynamic-form/question/question.service';
import { QuestionBase } from '../dae-dynamic-form/question/question-base';
import { MatConfirmDialogComponent } from '../mat-confirm-dialog/mat-confirm-dialog.component';
import { ColumnFilter, ColumnConfig, ElocalStorageItem } from './dynamic-table.model';
import { SelectionModel } from '@angular/cdk/collections';
import DynamicFilter from './dialogs/filters/dynamic-filter';
import * as _ from 'lodash';

@Component({
  selector: 'dae-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent implements OnInit {

  @Input() title: string;
  @Input() displayHeader: boolean = true;
  @Input() columns$: Observable<ColumnConfig[]>;
  @Input() dataSource$: Observable<any>;
  @Input() showFilters: boolean = true;
  @Input() modifyEnabled: boolean = false;
  @Input() deleteEnabled: boolean = false;
  @Input() displaySearchField: boolean = true;
  @Input() selectionEnabled: boolean = false;
  @Input() enablingAttribute: string;
  @Input() pageSize = 20;
  @Input() pageSizeOptions = [20, 50, 100];
  @Input() paginator: MatPaginator;
  @Input() paginate: boolean = true;
  
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

  @ViewChild(MatSort) private sort: MatSort;
  @ViewChild(MatPaginator) private internalPaginator: MatPaginator;

  private _appliedFilters: { [key: string]: any; } = {}; 
  private _columnsSubscription: Subscription;
  private _dataSourceSubscription: Subscription;
  public isLoading: boolean;
  
  constructor(private readonly columnFilterService: ColumnFilterService, 
    private readonly _dialog: MatDialog, 
    private _elementRef: ElementRef,
    private _questionService: QuestionService
  ) { }

  /**
   * Component initialization lifecycle hook
   */
  ngOnInit() {    
    this._validateComponent();
    this._setPaginator();
    this._getDataSource();
    this._getColumns();
  }

  /**
   * Check mandatory attributes for the component.
   */
  private _validateComponent() {
    if ( this._elementRef.nativeElement.id === '' ) {
      throw Error('Dynamic table needs an id.')
    }
  }

  /**
   * Triggers the data refresh from outside the component.
   */
  public refreshData() {
    this._getDataSource();
  }

  /**
   * Retrieve a list of typed filters from local storage.
   */
  private _getStoredAppliedFilter() {
    const storedFilters = JSON.parse(localStorage.getItem(this._getLocalStorageItem(ElocalStorageItem.FILTERS)));
    let filters = {};
    if ( !!storedFilters ) {
      Object.keys(storedFilters).forEach(key => {
        const subFilters = storedFilters[key];
        subFilters.forEach(subfilter => this._extractFilterFromLocalStorage(subfilter, key, filters));      
      });
    }
    return filters;
  }

  /**
   * Extract filter for a given data type from local storage JSON.
   * @param subfilter The filter to be parsed.
   * @param key The filter key.
   * @param filters The list of typed filters to be used by the application.
   */
  private _extractFilterFromLocalStorage(subfilter: any, key: string, filters: {}) {
    const column = subfilter['column'];
    const filter = new DynamicFilter(key, column);
    const keys = Object.keys(subfilter).filter(k => k !== 'column');
    keys.forEach(k => filter[k] = subfilter[k]);
    filters[column] = filter;
  }

  /**
   * Retrieve datasource observable from component input to set
   * the sort and paginator to.
   */
  private _getDataSource() {
    this.isLoading = true;
    this.dataSource$ = this.dataSource$.pipe(
      map(data => {
        return new FilteredDataSource(data)
      })
    );
    this._dataSourceSubscription = this.dataSource$.pipe(
      tap((datasource) => {
        this._handleDataSource(datasource)
      }))
    .subscribe(
      res => this.isLoading = false,
      err => this.isLoading = false,
      () => this.isLoading = false
  );
  }

  /**
   * Map datasource, then apply stored filters if necesseray then update datasource.
   * @param datasource The datasource to be mapped and updated.
   */
  private _handleDataSource(datasource: FilteredDataSource<any>) {
    this._mapDataSource(datasource);
    this._appliedFilters = this._getStoredAppliedFilter();
    this.updateDataSource();
    this._handleStoredSearchQuery();
  }

  /**
   * Trigger search if search query is stored in local storage.
   */
  private _handleStoredSearchQuery() {
    const searchQuery = localStorage.getItem(this._getLocalStorageItem(ElocalStorageItem.SEARCH));
    if (searchQuery !== '' && !!searchQuery) {
      this.searchModel = searchQuery;
      this.onSearch(searchQuery);
    }
  }

  /**
   * Map the received observable from the datasource to the local one
   * and setup sorting and pagination.
   * @param datasource Datasource from observable.
   */
  private _mapDataSource(datasource: FilteredDataSource<any>) {
    this.dataSource = datasource;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this._updateTitleBadge(datasource);
  }

  /**
   * Setup the component paginator
   */
  private _setPaginator() {
    if (this.paginator === undefined && this.paginate)
      this.paginator = this.internalPaginator;
  }

  /**
   * Retrieve columns observable from component input to set
   * the columns names and displayed columns.
   */
  private _getColumns() {
    this._columnsSubscription = this.columns$.pipe(
      tap((columns) => this._mapColumns(columns)))
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
    this.columns.forEach((column, index) => column.tag = this._prepareColumnName(column.tag, index));
    const displayedColumns = JSON.parse(localStorage.getItem(this._getLocalStorageItem(ElocalStorageItem.COLUMN)));
    this.displayedColumns = displayedColumns || this.columns
      .filter(column => column.visible && column.visible == 2)
      .map((column, index) => column.tag);
  }

  /**
   * Insert the selection column in front of the row
   * @param columns Data columns definition.
   */
  private _setSelectColumn(columns: ColumnConfig[]) {
    const columnTag = 'select';
    if (this.selectionEnabled) {
      const selectColumn = this._getTagColumnConfig(columnTag);
      this.columns.splice(0, 0, selectColumn); 
    }
  }

  /**
   * Adds the options cell if needed.
   */
  private _setOptionsColumn(columns: ColumnConfig[]) {
    const columnTag = 'options';
    if ( this.modifyEnabled || this.deleteEnabled ) {
      const optionsColumn = this._getTagColumnConfig(columnTag);
      this.columns.push(optionsColumn);
    }
  }

  /**
   * Get new column configuration for a givent tag.
   * @param columnTag The column tag to get column config for.
   */
  private _getTagColumnConfig(columnTag: string) {
    let column = new ColumnConfig();
    column = { tag: columnTag, type: columnTag, visible: 2 };
    return column;
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
    const filter = this.columnFilterService.getFilter(column.type);
    return filter != null;
  }

  /**
   * Checks if columns is already filtered and return the
   * filter value if this is the case.
   * @param column 
   */
  public isFiltered(column: ColumnConfig) {
    return this._appliedFilters[column.tag];
  }

  /**
   * Retrieve the filter description for a given column.
   * @param column The column to get the filter description for.
   */
  public getFilterDescription(column: ColumnConfig) {
    const filter = this._appliedFilters[column.tag];
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
    const filter = this.columnFilterService.getFilter(column.type);
    if (filter) {
      const columnFilter = new ColumnFilter();
      columnFilter.column = column;
      if (this._appliedFilters[column.tag])
        columnFilter.filter = Object.create(this._appliedFilters[column.tag]);
      this._openFilterDialog(columnFilter, filter, column);
    }
  }

  /**
   * Retrieve all documents distincts values to provide to the array filter dialog.
   * @param columnName The filtered column.
   */
  public getDistinctArrayElements(columnName: string) {
      return this.dataSource && this.dataSource.data 
        ? _.uniq(_.flatten(this.dataSource.data.map(d => d[columnName]).filter(ug => ug.length > 0))) : [];
  }

  /**
   * Opens the modal dialog for a column filter.
   * @param columnFilter The column filter.
   * @param filter The filter service object.
   * @param column The column to filter.
   */
  private _openFilterDialog(columnFilter: ColumnFilter, filter, column: ColumnConfig) {
    const dialogConfig = new MatDialogConfig();
    this._handleArrayDataType(column, columnFilter, dialogConfig);
    dialogConfig.data = columnFilter;
    const dialogRef = this._dialog.open(filter, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this._applyFilter(result, column);
      this._storeFiltersInLocalStorage();
    });
  }

  /**
   * Set the distinct array element list that will be available in the
   * filter input autocomplete.
   * @param column The column to get distinct elements for.
   * @param columnFilter The column filter object used to pass elements.
   * @param dialogConfig The filter dialog configuration object.
   */
  private _handleArrayDataType(column: ColumnConfig, columnFilter: ColumnFilter, dialogConfig: MatDialogConfig<any>) {
    if (column.type === 'array') {
      const elementsList = this.getDistinctArrayElements(column.tag);
      columnFilter.elements = elementsList;
      dialogConfig.minWidth = 600;
    }
  }

  /**
   * Opens the modal dialog for columns display selection.
   */
  public openColumnsSelectionModal() {
    const dialogConfig = this._getDialogConfig();
    this._handleColumnsDisplaySelection(dialogConfig);
  }
  
  /**
   * Builds the dialog data object
   */
  private _getDialogConfig() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      columns: this.columns,
      displayedColumns: this.displayedColumns,
      selectionEnabled: this.selectionEnabled,
      modifyEnabled: this.modifyEnabled,
      deleteEnabled: this.deleteEnabled
    };
    return dialogConfig;
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
    .subscribe(result => {
      this.displayedColumns = result.selectedColumns;
      this._storeDisplayedColumnsInLocalStorage();
    });
  }

  /**
   * Apply the filter to the data set regarding the modal dialog action.
   * @param result Result of the modal dialog closing.
   * @param column The column to filter.
   */
  private _applyFilter(result, column) {
    if (result)
      this._appliedFilters[column.tag] = result;
    else if (result === '')
      delete this._appliedFilters[column.tag];
    if (result || result === '')
      this.updateDataSource();
  }

  /**
   * Group applied filters by type and store them in local storage.
   */
  private _storeFiltersInLocalStorage() {
    let filters = {};
    Object.keys(this._appliedFilters).forEach(key => this._groupFiltersByType(key, filters))
    localStorage.setItem(this._getLocalStorageItem(ElocalStorageItem.FILTERS), JSON.stringify(filters));
  }

  /**
   * Store the list of displayed columns in the local storage.
   */
  private _storeDisplayedColumnsInLocalStorage() {
    localStorage.setItem(this._getLocalStorageItem(ElocalStorageItem.COLUMN), JSON.stringify(this.displayedColumns));
  }

  /**
   * Store the table search query in local storage.
   */
  private _storeSearchQueryInLocalStorage(searchQuery: string) {
    localStorage.setItem(this._getLocalStorageItem(ElocalStorageItem.SEARCH), searchQuery);
  }

  /**
   * Get the local storage item ID.
   */
  private _getLocalStorageItem(item: string) {
    const parsedUrl = new URL(window.location.href);
    return `${item}:${parsedUrl.pathname}/${this._elementRef.nativeElement.id}`;
  }

  /**
   * Group all applied filters by type to be stored in local storage.
   * @param key The filter key to store.
   * @param filters The filters to be stored.
   */
  private _groupFiltersByType(key: string, filters: {}) {
    const filter = this._appliedFilters[key];
    const filterType = filter.constructor.name;
    if (!filters[filterType]) {
      filters[filterType] = [];
    }
    filters[filterType].push(filter);
  }

  /**
   * Clear all filter applied to the datasource.
   */
  private _clearFilters() {
    this._appliedFilters = {};
    this._clearLocalStorageFilters();
    this.searchModel = '';
    this.onSearch(this.searchModel);
    this.updateDataSource();
  }

  /**
   * Remove store filters in local storage.
   */
  private _clearLocalStorageFilters() {
    localStorage.removeItem(this._getLocalStorageItem(ElocalStorageItem.FILTERS));
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
    const filterArray = Object.keys(filters).map((key) => filters[key]);
    return filterArray;
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
    return this._appliedFilters[filterColumn.tag];
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
    this._appliedFilters[filterColumn.tag] = filter;
    this.updateDataSource();
  }

  /**
   * Retrieve a column by its name.
   * @param columnName The column name to get the column for.
   */
  private _getColumnByName(columnName: string): ColumnConfig | undefined {
    return this.columns.find(c =>
      (c.tag ? c.tag.toLowerCase() : c.tag) === (columnName ? columnName.toLowerCase() : columnName)
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
    } 
    else if (filterValue == '') {
      this.updateDataSource();
    }
    this._storeSearchQueryInLocalStorage(filterValue);
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
   */
  public add() {
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
   */
  public clearFilters() {
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
