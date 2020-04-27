import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TableModel } from '../../table/table.model';
import { TableRowModel } from '../../table/table-row.model';
import { SimplePanelOptions } from './simple-panel-options.model';
import { ApiResponseModel } from '../../api/api-response.model';
import { ApiService } from '../../api/api.service';
import { DialogService } from '../dialog/dialog.service';
import { DialogModel } from '../dialog/dialog.model';
import { LoaderService } from '../../loader/loader.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiHalPagerModel } from '../../api/api-hal-pager.model';
import { FormGroup } from '@angular/forms';
import { DataBaseModelInterface } from '../../api/data-base-model.interface';
import { TranslateService } from '@ngx-translate/core';
import { SolcreAuthService } from 'ng-solcre-auth';
import { UiEventsService } from '../../ui-events.service';
import { TableHeaderModel } from '../../table/table-header.model';

@Component({
  selector: 'app-simple-panel',
  templateUrl: './simple-panel.component.html',
  styles: ['./simple-panel.component.css'],
  providers: [DialogService]
})
export class SimplePanelComponent implements OnInit {

  @Input() tableModel: TableModel;
  @Input() simplePanelOptions: SimplePanelOptions;
  @Input() primaryForm: FormGroup;

  @Input() onParseRow: (row: any) => TableRowModel;

  //Functions to send to parent before update or add a row
  @Input() onGetDataBaseModel: (json: any) => DataBaseModelInterface;

  @Output() onExtraAction: EventEmitter<any> = new EventEmitter();

  //start apihalpager in currentpage = 1
  apiHalPagerModel: ApiHalPagerModel = new ApiHalPagerModel(1);

  currentSorting: any = {};
  currentKeySorting: string; // clicked column

  showForm: boolean = false;
  showSave: boolean = false;
  globalLoading: boolean = true;

  placeHolderText: string;

  domainCode: string;
  isEmpty: boolean = false;
  column: TableHeaderModel;

  //Loaders 
  pagerLoading: boolean;
  primaryFormLoading: boolean;
  dialogLoading: boolean;

  dialogActive: boolean;

  constructor(
    private apiService: ApiService,
    private dialogService: DialogService,
    private loaderService: LoaderService,
    private translateService: TranslateService,
    private authService: SolcreAuthService,
    private uiEvents: UiEventsService,

  ) { }

  ngOnInit() {
    this.translateService.get('placeholder.empty').subscribe(response => {
      this.placeHolderText = response;
    });
    if (this.tableModel instanceof TableModel) {
      this.domainCode = this.authService.getCode();
      this.onGetRows();
    }
  }

  onChangePage(page) {
    this.globalLoading = true;
    this.pagerLoading = true;
    this.loaderService.start();
    //Save the new page number 
    this.apiHalPagerModel.currentPage = page;
    this.tableModel.removeBody();
    this.onGetRows();
  }

  onGetRows() {
    this.isEmpty = false;
    //set the query paramaters 
    let params: any = {};
    if (this.simplePanelOptions instanceof SimplePanelOptions) {
      if (this.apiHalPagerModel.totalPages == 1) { //If is one page -> basicSort
        this.tableModel.basicSort(this.currentKeySorting, this.currentSorting[this.currentKeySorting]);
        if (this.tableModel.body.length == 0) {
          this.isEmpty = true;
        }
        this.loaderService.done();
      } else {
        this.tableModel.removeBody();
        if (this.currentKeySorting) {
          params = {
            page: this.apiHalPagerModel.currentPage,
            ["sort[" + this.currentKeySorting + "]"]: this.currentSorting[this.currentKeySorting]
          };
        } else {
          params = {
            page: this.apiHalPagerModel.currentPage
          };
        };

        this.apiService.fetchData(this.domainCode + this.simplePanelOptions.URI, params).subscribe((response: ApiResponseModel) => {
          this.pagerLoading = false;
          if (response.hasCollectionResponse()) {
            this.apiHalPagerModel = response.pager;
            response.data.forEach((response: any) => {

              // Send each row to the corresponding model
              let row: TableRowModel = this.onParseRow(response);
              this.tableModel.addRow(row);
            });

          }
          if (this.tableModel.body.length == 0) {
            this.isEmpty = true;
          }
          this.globalLoading = false;
          if (this.column) {
            this.column.loading = false;
          }
          this.loaderService.done();
        })
      }
    }
  }

  onSave() {
    //if null -> is a new row
    if (this.primaryForm.value.id == null) {
      if (!this.primaryForm.valid) { //If input is empty show the input holder
        Object.keys(this.primaryForm.controls).forEach(field => {
          const control = this.primaryForm.get(field);
          control.markAsTouched();
        });
      } else {
        this.primaryFormLoading = true;
        this.onAdd(this.primaryForm.value);

      }
      //else is modified row
    } else {
      if (!this.primaryForm.valid) {
        Object.keys(this.primaryForm.controls).forEach(field => {
          const control = this.primaryForm.get(field);
          control.markAsTouched();
        });
      } else {
        this.primaryFormLoading = true;
        this.onUpdateRow(this.primaryForm.value);
      }
    }
  }

  onShowAdd() {
    this.uiEvents.internalModalStateChange.emit(true);
    this.showForm = true;
  }

  onHideForm() {
    this.uiEvents.internalModalStateChange.emit(false);

    //check if the user change the input values
    if (this.primaryForm.dirty) {
      let warning: string;
      //get the translate message and save in let
      this.translateService.get('share.dialog.warning').subscribe(response => {
        warning = response;
      });
      this.dialogService.open(new DialogModel(warning, () => {
        this.primaryForm.reset();
        this.showForm = false;
        this.showSave = false;
        this.dialogActive = false;
        this.dialogLoading = false;
      }));
    } else {
      this.primaryForm.reset();
      this.showForm = false;
      this.showSave = false;
    }
  }

  onAdd(model: any) {
    this.loaderService.start();
    let rowToAdd: DataBaseModelInterface;
    if (model) {
      rowToAdd = this.onGetDataBaseModel(model);
    }
    if (rowToAdd) {
      let json: any = rowToAdd.toJSON();
      this.apiService.createObj(this.domainCode + this.simplePanelOptions.URI, json).subscribe((response: ApiResponseModel) => {
        this.primaryFormLoading = false;
        this.showForm = false;
        if (response.hasSingleResponse()) {
          let row: TableRowModel = this.onParseRow(response.data);
          this.tableModel.addRow(row);
        }
        this.uiEvents.internalModalStateChange.emit(false);
        this.loaderService.done();
      },
        (error: HttpErrorResponse) => {
          this.dialogService.open(new DialogModel(error.error.detail));
          this.loaderService.done();
          this.primaryFormLoading = false;
        });
    }
    this.primaryForm.reset();
  }

  onUpdate(row: TableRowModel) {
    this.uiEvents.internalModalStateChange.emit(true);
    this.showForm = true;
    this.showSave = true;
    //parse the fields to input.
    if (row instanceof TableRowModel) {
      this.primaryForm.patchValue(row.model);
    }
  }

  onUpdateRow(model: any) {
    let rowToAdd: DataBaseModelInterface;
    //Parse inputs value to model to update
    if (model) {
      rowToAdd = this.onGetDataBaseModel(model);
    }
    if (rowToAdd) {
      let json: any = rowToAdd.toJSON();
      //save the model
      this.apiService.updateObj(this.domainCode + this.simplePanelOptions.URI, json).subscribe((response: any) => {
        this.loaderService.start();
        this.primaryFormLoading = false;
        if (response.hasSingleResponse()) {
          let newRow: TableRowModel = this.onParseRow(response.data);
          let row: TableRowModel = this.tableModel.findRow(model.id);
          if (row instanceof TableRowModel) {
            this.showForm = false;

            //update the data and model 
            row.data = newRow.data;
            row.model = newRow.model;
            this.tableModel.updateRow(row);
            this.loaderService.done();

          }
        }
      },
        (error: HttpErrorResponse) => {
          this.dialogService.open(new DialogModel(error.error.detail));
          this.loaderService.done();
        })
    }
    this.primaryForm.reset();
    // this.loaderService.done();
  }

  onDelete(row: TableRowModel) {
    //Open dialog
    if (row instanceof TableRowModel) {
      let message: string;
      //get the translate message and save in let
      this.translateService.get('share.dialog.message').subscribe(response => {
        message = response;
      });

      let dialog = 
      //row.data[1] is the name 
      this.dialogService.open(new DialogModel(message + row.data[1] + "?", () => {
        // this.loaderService.start();
        //Delete the usergroup
        this.apiService.deleteObj(this.domainCode + this.simplePanelOptions.URI, row.id).subscribe((response: any) => {
            this.tableModel.removeRow(row.id);
            this.dialogService.close();
            this.loaderService.done();   
        },
          (error: HttpErrorResponse) => {
            this.dialogService.close(); //close the old dialog
            this.dialogService.open(new DialogModel(error.error.detail)); //open the error dialog
            this.loaderService.done();
          }
        )
      }));
    }
  }

  onExtraActionClick(data: any) {
    this.onExtraAction.emit(data);
  }

  onSort(event: { column: TableHeaderModel, value: string }): void {
    // this.loaderService.start();
    this.currentKeySorting = event.column.key;
    this.currentSorting[event.column.key] = event.value;
    this.column = event.column;
    this.onGetRows();

  }

}