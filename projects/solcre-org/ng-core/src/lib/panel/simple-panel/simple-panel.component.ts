import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { TableModel } from '../../table/table.model';
import { TableRowModel } from '../../table/table-row.model';
import { SimplePanelOptions } from './simple-panel-options.model';
import { ApiResponseModel } from '../../api/api-response.model';
import { ApiService } from '../../api/api.service';
import { DialogService } from '../dialog/dialog.service';
import { DialogModel } from '../dialog/dialog.model';
import { ApiHalPagerModel } from '../../api/api-hal-pager.model';
import { DataBaseModelInterface } from '../../api/data-base-model.interface';
import { UiEventsService } from '../../ui-events.service';
import { TableHeaderModel } from '../../table/table-header.model';
import { SimplePanelLoadersModel } from './simple-panel-loaders.model';
import { ToastsService } from '../../structure/toasts/toasts.service';
import { ArrayUtility } from '../../utilities/array.utility';
import { FormUtility } from '../../utilities/form.utility';

@Component({
	selector: 'ng-solcre-simple-panel',
	templateUrl: './simple-panel.component.html',
	styles: ['./simple-panel.component.css'],
	providers: [DialogService]
})
export class SimplePanelComponent implements OnInit {

	// Inputs
	@Input() tableModel: TableModel;
	@Input() simplePanelOptions: SimplePanelOptions;
	@Input() primaryForm: FormGroup;
	@Input() onParseRow: (row: any) => TableRowModel;
	@Input() onGetJSON: (json: any, row: TableRowModel) => any;

	// Outputs
	@Output() onExtraAction: EventEmitter<any> = new EventEmitter();
	@Output() onBeforeOpen: EventEmitter<any> = new EventEmitter();
	@Output() onBeforeSend: EventEmitter<any> = new EventEmitter();

	// Models
	apiHalPagerModel: ApiHalPagerModel = new ApiHalPagerModel(1);
	currentSorting: any = {};
	currentKeySorting: string; // clicked column
	showForm: boolean = false;
	updateMode: boolean = false;
	placeHolderText: string;
	activeRow: TableRowModel; // Current active row editing

	// Loaders 
	loader: SimplePanelLoadersModel;

	// Inject services
	constructor(
		private apiService: ApiService,
		private dialogService: DialogService,
		private toastsService: ToastsService,
		private translateService: TranslateService,
		private uiEvents: UiEventsService) { }

	// On component init
	ngOnInit(): void {
		// Init vars
		this.loader = new SimplePanelLoadersModel();

		// Fetch rows
		this.onGetRows();
	}

	onGetRows() {
		// Must pass options
		if (this.simplePanelOptions instanceof SimplePanelOptions) {
			// Start loading
			this.loader.global = true;

			// Set the query paramaters and uri
			const queryParams: any = this.resolveQueryParams();
			const uri: string = this.getUri();

			// Clear body
			this.tableModel.removeBody();

			// Do request
			this.apiService.fetchData(uri, queryParams).subscribe(
				(response: ApiResponseModel) => {
					// Control response
					if (response.hasCollectionResponse()) {
						this.apiHalPagerModel = response.pager;

						// Map 
						ArrayUtility.each(response.data, (json: any) => {
							// Send each row to the corresponding model
							this.tableModel.addRow(
								this.onParseRow(response)
							);
						});
					}

					// Stop all loadings
					this.loader.clear();
				},
				(error: HttpErrorResponse) => {
					// Stop all loadings
					this.loader.clear();

					// Display toasts
					this.toastsService.showHttpError(error);
				}
			);
		} else {
			// Console warning to devs
			console.warn("simplePanelOptions is not defined.")
		}
	}

	// Custom events
	onChangePage(page: number) {
		// Start loading pager
		this.loader.pager = true;

		//Save the new page number 
		this.apiHalPagerModel.currentPage = page;

		// Do fetch
		this.onGetRows();
	}

	onSave() {
		// Control form is valid
		if (this.primaryForm.valid) {
			// Controls if is a new obj or update it
			if (this.primaryForm.value.id == null) {
				// Do add obj
				this.addObj(this.primaryForm.value, null);
			} else {
				// Do update
				this.updateObj(this.primaryForm.value, this.activeRow);
			}
		} else {
			// Trigger form validations
			FormUtility.validateAllFormFields(this.primaryForm);
		}
	}

	onAddRow(): void {
		const json: any = {};

		// Clear form
		this.primaryForm.reset();

		// Emit on before open
		this.onBeforeOpen.emit(json);

		// Emmit ui events
		this.uiEvents.internalModalStateChange.emit(true);

		// Open modal
		this.showForm = true;
		this.updateMode = false;

		// Patch default values
		this.primaryForm.patchValue(json);
	}

	onUpdateRow(row: TableRowModel) {
		//parse the fields to input.
		if (row instanceof TableRowModel) {
			const json: any = row.model.toJSON();

			// Load active row
			this.activeRow = row;

			// Emit on before open
			this.onBeforeOpen.emit(json);

			// Clear form
			this.primaryForm.reset();

			// Emmit ui events
			this.uiEvents.internalModalStateChange.emit(true);

			// Open modal with update mode
			this.showForm = true;
			this.updateMode = true;

			// Patch form
			this.primaryForm.patchValue(json);
		} else {
			// Dev warning
			console.warn("Row is not instanceof TableRowModel");
		}
	}

	onDeleteRow(row: TableRowModel) {
		//Open dialog
		if (row instanceof TableRowModel) {
			//get the translate message and save in let
			let message: string = this.translateService.instant('share.dialog.message');

			// Open dialog
			this.dialogService.open(new DialogModel(message + row.reference + "?", () => {
				// Remove object
				this.deleteObj(row);
			}));
		}
	}

	// Hide modal
	onHideForm(): void {
		// Check if the user change the input values
		if (this.primaryForm.dirty) {
			// Open dialog before close
			this.dialogService.open(
				new DialogModel('share.dialog.warning', () => {
					// Clear vars
					this.showForm = false;
					this.updateMode = false;
					this.activeRow = null;

					// Emit event
					this.uiEvents.internalModalStateChange.emit(false);
				})
			);
		} else {
			// Clear vars
			this.showForm = false;
			this.updateMode = false;
			this.activeRow = null;

			// Emit event
			this.uiEvents.internalModalStateChange.emit(false);
		}
	}

	onExtraActionClick(data: any) {
		this.onExtraAction.emit(data);
	}

	onSort(event: { column: TableHeaderModel, value: string }): void {
		// Load sortings
		this.currentKeySorting = event.column.key;
		this.currentSorting[event.column.key] = event.value;

		// Check page counts
		if (this.apiHalPagerModel.totalPages == 1) {
			this.sortTableInMemory();
		} else {
			this.onGetRows();
		}
	}

	// Private methods
	private getUri(): string {
		let uri: string = this.simplePanelOptions.URI;

		if (this.simplePanelOptions.clientCode) {
			uri = '/' + this.simplePanelOptions.clientCode + this.simplePanelOptions.URI;
		}
		return uri;
	}

	private sortTableInMemory(): void {
		// Sort
		this.tableModel.basicSort(this.currentKeySorting, this.currentSorting[this.currentKeySorting]);

		// Stop all loadings
		this.loader.clear();
	}

	private resolveQueryParams(): any {
		// Init var with default paras
		const queryParams: any = Object.assign(
			{ "page": this.apiHalPagerModel.currentPage },
			this.simplePanelOptions.defaultQueryParams
		);

		// Load sorting
		if (this.currentKeySorting) {
			queryParams["sort[" + this.currentKeySorting + "]"] = this.currentSorting[this.currentKeySorting];
		}
		return queryParams;
	}

	private addObj(model: any, row: TableRowModel): void {
		// Chek value
		if (model) {
			const json: any = this.onGetJSON(model, row) || model;
			const uri: string = this.getUri();

			// Emit event if parent need to modify json
			this.onBeforeSend.emit(json);

			// Start modal loader
			this.loader.primaryModal = true;

			// Do request
			this.apiService.createObj(uri, json).subscribe(
				(response: ApiResponseModel) => {
					// Stop modal loader
					this.loader.primaryModal = false;

					// Check response
					if (response.hasSingleResponse()) {
						// Add to tablemodel
						this.tableModel.addRow(
							this.onParseRow(response.data)
						);
					}

					// Call hide modal
					this.onHideForm();
				},
				(error: HttpErrorResponse) => {
					// Display toasts
					this.toastsService.showHttpError(error);

					// Stop modal loader
					this.loader.primaryModal = false;
				}
			);
		}
	}

	private updateObj(model: any, row: TableRowModel) {
		// Chek value
		if (model) {
			const json: any = this.onGetJSON(model, row) || model;
			const uri: string = this.getUri();

			// Emit event if parent need to modify json
			this.onBeforeSend.emit(json);

			// Start modal loader
			this.loader.primaryModal = true;

			// Detect method to update
			let observer: Observable<ApiResponseModel>;

			// Check must update with patch?
			if (this.simplePanelOptions.updateWithPatch) {
				observer = this.apiService.partialUpdateObj(uri, json.id, json);
			} else {
				observer = this.apiService.partialUpdateObj(uri, json.id, json);
			}

			// Do request
			observer.subscribe(
				(response: any) => {
					// Check response
					if (response.hasSingleResponse()) {
						// Parse row
						let newRow: TableRowModel = this.onParseRow(response.data);
						// Find previous row
						let row: TableRowModel = this.tableModel.findRow(model.id);

						if (row instanceof TableRowModel) {
							//update the data and model 
							row.data = newRow.data;
							row.model = newRow.model;

							// Update to table model
							this.tableModel.updateRow(row);
							
							// Close modal
							this.onHideForm();
						}
					}

					// Stop all loadings
					this.loader.clear();
				},
				(error: HttpErrorResponse) => {
					// Display toasts
					this.toastsService.showHttpError(error);

					// Stop modal loader
					this.loader.primaryModal = false;
				}
			);
		}
		this.primaryForm.reset();
	}

	private deleteObj(rowId: any): void {
		const uri: string = this.getUri();
		//Delete the usergroup
		this.apiService.deleteObj(uri, rowId).subscribe(
			(response: any) => {
				// Remove from table model
				this.tableModel.removeRow(rowId);

				// Close dialog
				this.dialogService.close();
			},
			(error: HttpErrorResponse) => {
				// Display toasts
				this.toastsService.showHttpError(error);

				// Stop modal loader
				this.loader.primaryModal = false;
			}
		);
	}
}
