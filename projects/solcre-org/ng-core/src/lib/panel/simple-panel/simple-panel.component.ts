import { Component, OnInit, Input, EventEmitter, Output, TemplateRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, forkJoin, Observer } from 'rxjs';

import { TableModel } from '../table/table.model';
import { TableRowModel } from '../table/table-row.model';
import { SimplePanelOptions } from './simple-panel-options.model';
import { ApiResponseModel } from '../../api/api-response.model';
import { ApiService } from '../../api/api.service';
import { DialogService } from '../dialog/dialog.service';
import { DialogModel } from '../dialog/dialog.model';
import { ApiHalPagerModel } from '../../api/api-hal-pager.model';
import { UiEventsService } from '../../ui-events.service';
import { TableHeaderModel } from '../table/table-header.model';
import { SimplePanelLoadersModel } from './simple-panel-loaders.model';
import { ToastsService } from '../../structure/toasts/toasts.service';
import { ArrayUtility } from '../../utilities/array.utility';
import { FormUtility } from '../../utilities/form.utility';
import { RemoteDataService } from './remote-data/remote-data.service';
import { SimplePanelRowParsingInterface } from './simple-panel-row-parsing.interface';
import { DataBaseModelInterface } from '../../api/data-base-model.interface';
import { BreadcrumbModel } from '../breadcrumbs/breadcrumb.model';

@Component({
	selector: 'ng-solcre-simple-panel',
	templateUrl: './simple-panel.component.html',
	styles: ['./simple-panel.component.css'],
	providers: [DialogService]
})
export class SimplePanelComponent implements OnInit {

	// Inputs
	@Input() breadcrumbs: BreadcrumbModel[];
	@Input() tableModel: TableModel;
	@Input() options: SimplePanelOptions;
	@Input() primaryForm: FormGroup;
	@Input() customTableTemplate: TemplateRef<any>;
	@Input() onGetJSON: (json: any, row: TableRowModel) => any;

	// Outputs
	@Output() onRemoteData: EventEmitter<any> = new EventEmitter();
	@Output() onBeforeOpen: EventEmitter<any> = new EventEmitter();
	@Output() onBeforeSend: EventEmitter<any> = new EventEmitter();
	@Output() onParseModel: EventEmitter<SimplePanelRowParsingInterface> = new EventEmitter();

	// Models
	apiHalPagerModel: ApiHalPagerModel = new ApiHalPagerModel(1);
	currentSorting: any = {};
	currentKeySorting: string; // clicked column
	showForm: boolean = false;
	updateMode: boolean = false;
	placeHolderText: string;
	activeRow: TableRowModel; // Current active row editing
	activeHeaderSorting: TableHeaderModel;

	// Loaders 
	loader: SimplePanelLoadersModel;

	// Inject services
	constructor(
		private apiService: ApiService,
		private dialogService: DialogService,
		private toastsService: ToastsService,
		private translateService: TranslateService,
		private remoteDataService: RemoteDataService,
		private uiEvents: UiEventsService) { }

	// On component init
	ngOnInit(): void {
		// Init vars
		this.loader = new SimplePanelLoadersModel();

		// Fetch rows
		this.initialFetchRows();
	}

	// Custom events
	onChangePage(page: number) {
		// Start loading pager
		this.loader.pager = true;

		//Save the new page number 
		this.apiHalPagerModel.currentPage = page;

		// Do fetch
		this.fetchRows();
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
				this.deleteObj(row.id);
			}));
		}
	}

	// Hide modal
	onHideForm(skpiDirtyCheck?: boolean): void {
		// Check if the user change the input values
		if (this.primaryForm.dirty && !skpiDirtyCheck) {
			// Open dialog before close
			this.dialogService.open(
				new DialogModel('share.dialog.warning', () => {
					// Clear vars
					this.showForm = false;
					this.updateMode = false;
					this.activeRow = null;

					// Emit event
					this.uiEvents.internalModalStateChange.emit(false);

					// Close dialog
					this.dialogService.close();
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

	onSort(event: { column: TableHeaderModel, value: string }): void {
		// Load sortings
		this.currentKeySorting = event.column.key;
		this.currentSorting[event.column.key] = event.value;

		// Check page counts
		if (this.apiHalPagerModel.totalPages == 1) {
			// Stop loading
			event.column.loading = false;

			// Sort in memory
			this.sortTableInMemory();
		} else {
			this.activeHeaderSorting = event.column;

			// Fetch rows
			this.fetchRows();
		}
	}

	// Private methods
	private getUri(): string {
		let uri: string = this.options.URI;

		if (this.options.clientCode) {
			uri = '/' + this.options.clientCode + this.options.URI;
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
			this.options.defaultQueryParams
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
						// Parse json and push or update it
						this.parseRow(response.data);
					}

					// Call hide modal
					this.onHideForm(true);
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
			if (this.options.updateWithPatch) {
				observer = this.apiService.partialUpdateObj(uri, json.id, json);
			} else {
				observer = this.apiService.updateObj(uri, json);
			}

			// Do request
			observer.subscribe(
				(response: any) => {
					// Check response
					if (response.hasSingleResponse()) {
						// Parse json and push or update it
						this.parseRow(response.data, true);
					}

					// Close modal
					this.onHideForm(true);

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
	}

	private deleteObj(rowId: any): void {
		const uri: string = this.getUri();
		// Stop modal loader
		this.loader.dialog = true;

		//Delete the usergroup
		this.apiService.deleteObj(uri, rowId).subscribe(
			(response: any) => {
				// Stop modal loader
				this.loader.dialog = false;

				// Remove from table model
				this.tableModel.removeRow(rowId);

				// Close dialog
				this.dialogService.close();
			},
			(error: HttpErrorResponse) => {
				// Stop modal loader
				this.loader.dialog = false;

				// Display toasts
				this.toastsService.showHttpError(error);
			}
		);
	}

	private fetchRows() {
		// Must pass options
		if (this.options instanceof SimplePanelOptions) {
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
							// Parse json and push or update it
							this.parseRow(json);
						});
					}

					// Stop all loadings
					this.loader.clear();

					// Check active header sorting
					if(this.activeHeaderSorting instanceof TableHeaderModel) {
						this.activeHeaderSorting.loading = false;
					}
				},
				(error: HttpErrorResponse) => {
					// Stop all loadings
					this.loader.clear();

					// Check active header sorting
					if(this.activeHeaderSorting instanceof TableHeaderModel) {
						this.activeHeaderSorting.loading = false;
					}

					// Display toasts
					this.toastsService.showHttpError(error);
				}
			);
		} else {
			// Console warning to devs
			console.warn("simplePanelOptions is not defined.")
		}
	}

	private initialFetchRows(){
		// Must pass options
		if (this.options instanceof SimplePanelOptions) {
			// has value
			if (ArrayUtility.hasValue(this.options.remoteData)) {
				// Start global loading
				this.loader.global = true;

				// Set remote data
				this.remoteDataService.setRemoteDate(this.options.remoteData);

				// Wait remote data at the same time with fetchrows
				this.remoteDataService.process().subscribe( null, null,
					() => {
						// Emit event
						this.onRemoteData.emit(this.remoteDataService.getData());

						// On complete start fetch
						this.fetchRows();
					}
				)
			} else {
				// Normal flow
				this.fetchRows();
			}
		}
	}

	private parseRow(json: any, updating?: boolean): void {
		// Call on parse model, the parent must call callback and complete with the result model
		this.onParseModel.emit({
			callback: (model: DataBaseModelInterface) => {
				// Check updating
				if (updating) {
					let foundRow: TableRowModel = this.tableModel.findRow(model.getId());

					if (foundRow instanceof TableRowModel) {
						//update the data and model 
						foundRow.model = model;
						foundRow.reference = model.getReference();
			
						// Update to table model
						this.tableModel.updateRow(foundRow);
					}
				} else {
					// Create row
					const row: TableRowModel = new TableRowModel(
						model.getId(), 
						model.getReference(), 
						model
					);

					// If not updating add it
					this.tableModel.addRow(row);
				}
			},
			json: json
		});
	}
}
