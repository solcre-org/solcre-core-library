import { Component, OnInit, Input, EventEmitter, Output, TemplateRef, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { TableModel } from '../table/table.model';
import { TableRowModel } from '../table/table-row.model';
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
import { TableOptions } from '../table/table-options.interface';
import { SimplePanelOptions } from './simple-panel-options.interface';
import { SimplePanelService } from './simple-panel.service';
import { ObjectUtility } from '../../utilities/object.utility';
import { TableSortEnum } from '../table/table-sort.enum';
import { TranslationsService } from '../../others/translations/translations.service';

@Component({
	selector: 'ng-solcre-simple-panel',
	templateUrl: './simple-panel.component.html',
	providers: [DialogService]
})
export class SimplePanelComponent implements OnInit, OnDestroy {

	// Inputs
	@Input() breadcrumbs: BreadcrumbModel[];
	@Input() tableModel: TableModel;
	@Input() tableOptions: TableOptions;
	@Input() options: SimplePanelOptions;
	@Input() primaryForm: FormGroup;
	@Input() customTableTemplate: TemplateRef<any>;
	@Input() onGetJSON: (json: any, row: TableRowModel) => any;

	// Outputs
	@Output() onBeforeSave: EventEmitter<any> = new EventEmitter();
	@Output() onRemoteData: EventEmitter<any> = new EventEmitter();
	@Output() onFetchRowsEnds: EventEmitter<TableRowModel[]> = new EventEmitter();
	@Output() onBeforeOpen: EventEmitter<any> = new EventEmitter();
	@Output() onBeforeSend: EventEmitter<any> = new EventEmitter();
	@Output() onSaveSuccess: EventEmitter<ApiResponseModel> = new EventEmitter();
	@Output() onParseModel: EventEmitter<SimplePanelRowParsingInterface> = new EventEmitter();
	@Output() onRowChanged: EventEmitter<TableRowModel> = new EventEmitter();
	@Output() onRowAdded: EventEmitter<TableRowModel> = new EventEmitter();
	@Output() onError: EventEmitter<HttpErrorResponse | string> = new EventEmitter();
	@Output() onRowUpdated: EventEmitter<TableRowModel> = new EventEmitter();
	@Output() onModalClosed: EventEmitter<void> = new EventEmitter();
	@Output() onHalPagerChanges: EventEmitter<ApiHalPagerModel> = new EventEmitter();

	// Models
	apiHalPagerModel: ApiHalPagerModel = new ApiHalPagerModel(1);
	currentSorting: any = {};
	currentKeySorting: string; // clicked column
	showForm: boolean = false;
	updateMode: boolean = false;
	placeHolderText: string;
	activeRow: TableRowModel; // Current active row editing
	activeHeaderSorting: TableHeaderModel;
	subscribers: Subscription[];
	translations: any = {};

	// Loaders 
	loader: SimplePanelLoadersModel;

	// Inject services
	constructor(
		private apiService: ApiService,
		private dialogService: DialogService,
		private toastsService: ToastsService,
		private remoteDataService: RemoteDataService,
		private uiEvents: UiEventsService,
		private simplePanelService: SimplePanelService,
		private translateService: TranslationsService) { }

	// On component init
	ngOnInit(): void {
		// Check options
		if (!this.options) {
			this.options = {};
		}

		//Load translations
		this.translations = this.translateService.get('simplePanel');

		// Init vars
		this.loader = new SimplePanelLoadersModel();

		// Start watching events
		this.subscribers = [
			this.simplePanelService.getOnRefreshRows().subscribe((params: any) => {
				// Do fetch
				this.fetchRows(params);
			}),
			this.simplePanelService.getOnChangeLoader().subscribe((loader: SimplePanelLoadersModel) => {
				// Update loaders
				this.loader.updateFromOtherLoader(loader);
			}),
			this.simplePanelService.getOnAddRow().subscribe(() => {
				// Show add modal
				this.onAddRow();
			}),
			this.simplePanelService.getOnEditRow().subscribe((row: TableRowModel) => {
				// Show edit modal
				this.onUpdateRow(row);
			}),
			this.simplePanelService.getOnDeleteRow().subscribe((row: TableRowModel) => {
				// Show delete modal
				this.onDeleteRow(row);
			})
		];

		// Fetch rows
		this.initialFetchRows();
	}

	// On component destroy
	ngOnDestroy(): void {
		ArrayUtility.each(this.subscribers, (subscriber: Subscription) => {
			subscriber.unsubscribe();
		});
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
			const json: any = ObjectUtility.clone(this.primaryForm.value);

			// Emit on before save
			this.onBeforeSave.emit(json);

			// Controls if is a new obj or update it
			if (this.primaryForm.value.id == null) {
				// Do add obj
				this.addObj(json, null);
			} else {
				// Do update
				this.updateObj(json, this.activeRow);
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
			let message: string = this.translations.deleteMessage;

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
				new DialogModel(this.translations.warningMessage, () => {
					// Clear vars
					this.showForm = false;
					this.updateMode = false;
					this.activeRow = null;

					// Emit event
					this.uiEvents.internalModalStateChange.emit(false);

					//Notify
					this.onModalClosed.emit();

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

			//Notify
			this.onModalClosed.emit();
		}
	}

	onSort(event: { column: TableHeaderModel, value: TableSortEnum }): void {
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

			// Fetch rows with ignore loader
			this.fetchRows(null, true);
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

	private resolveQueryParams(params?: any): any {
		// Init var with default paras
		let queryParams: any = Object.assign(
			{ "page": this.apiHalPagerModel.currentPage },
			this.options.defaultQueryParams
		);

		// Maybe some overrides??
		queryParams = Object.assign(queryParams, params);

		//Clear undefined values
		ArrayUtility.each(queryParams, (value: any, key: string) => {
			if (value === undefined) {
				delete queryParams[key];
			}
		});

		// Load sorting if all is load correctly
		if (this.currentKeySorting && this.currentSorting[this.currentKeySorting]) {
			queryParams["sort[" + this.currentKeySorting + "]"] = this.currentSorting[this.currentKeySorting];
		}
		return queryParams;
	}

	private resolveHeaders(): any {
		let headers: any = {
			'Cache-Control': 'no-cache'
		};

		//Check options
		if (this.options.defaultHeaders) {
			headers = Object.assign(headers, this.options.defaultHeaders);
		}
		return headers;
	}

	private addObj(model: any, row: TableRowModel): void {
		// Chek value
		if (model) {
			const json: any = this.onGetJSON ? (this.onGetJSON(model, row) || model) : model; //TODO: improve this code
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

						//Increase count
						this.apiHalPagerModel.increaseTotalItems();
					} else if (response.hasCollectionResponse()) {
						// Parse each data 
						ArrayUtility.each(response.data, (json: any) => {
							// Parse json and push or update it
							this.parseRow(json);

							//Increase count
							this.apiHalPagerModel.increaseTotalItems();
						});
					}

					//Trigger on save success
					this.onSaveSuccess.emit(response)

					// Call hide modal
					this.onHideForm(true);
				},
				(error: HttpErrorResponse) => {
					// Display error
					if(!this.options.preventProcessHttpErrors){
						this.toastsService.showHttpError(error);
					} else {
						this.onError.emit(error);
					}

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
			const id: any = json.id;
			const uri: string = this.getUri();

			// Emit event if parent need to modify json
			this.onBeforeSend.emit(json);

			//Remove id from the body
			if(!this.options.keepIdOnUpdate){ delete json.id; }

			// Start modal loader
			this.loader.primaryModal = true;

			// Detect method to update
			let observer: Observable<ApiResponseModel>;

			// Check must update with patch?
			if (this.options.updateWithPatch) {
				observer = this.apiService.partialUpdateObj(uri, id, json);
			} else {
				observer = this.apiService.updateObj(uri, id, json);
			}

			// Do request
			observer.subscribe(
				(response: any) => {
					// Check response
					if (response.hasSingleResponse()) {
						// Parse json and push or update it
						this.parseRow(response.data, true);
					}

					//Trigger on save success
					this.onSaveSuccess.emit(response)

					// Close modal
					this.onHideForm(true);

					// Stop all loadings
					this.loader.clear();
				},
				(error: HttpErrorResponse) => {
					// Display error
					if(!this.options.preventProcessHttpErrors){
						this.toastsService.showHttpError(error);
					} else {
						this.onError.emit(error);
					}

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

				//Decrease count
				this.apiHalPagerModel.decreaseTotalItems();

				// Close dialog
				this.dialogService.close();
			},
			(error: HttpErrorResponse) => {
				// Stop modal loader
				this.loader.dialog = false;

				// Display error
				if(!this.options.preventProcessHttpErrors){
					this.toastsService.showHttpError(error);
				} else {
					this.onError.emit(error);
				}
			}
		);
	}

	private fetchRows(params?: any, ignoreLoader?: boolean): void {
		// Must pass options
		if (this.options) {
			// Start loading
			if (!ignoreLoader) {
				this.loader.global = true;
			}

			// Set the query paramaters and uri
			const queryParams: any = this.resolveQueryParams(params);
			const uri: string = this.getUri();
			const headers: any = this.resolveHeaders();

			// Do request
			this.apiService.fetchData(uri, queryParams, headers).subscribe(
				(response: ApiResponseModel) => {
					// Clear body
					this.tableModel.removeBody();

					// Control response
					if (response.hasCollectionResponse()) {

						// Load pager
						this.apiHalPagerModel = response.pager;

						// Map 
						ArrayUtility.each(response.data, (json: any) => {
							// Parse json and push or update it
							this.parseRow(json);
						});

						// Notify changes
						this.onHalPagerChanges.emit(this.apiHalPagerModel);
					}

					// Stop all loadings
					this.loader.clear();

					// Check active header sorting
					if (this.activeHeaderSorting instanceof TableHeaderModel) {
						this.activeHeaderSorting.loading = false;
					}

					//Emit fetch rows ends
					this.onFetchRowsEnds.emit(this.tableModel.body);
				},
				(error: HttpErrorResponse) => {
					// Stop all loadings
					this.loader.clear();

					// Check active header sorting
					if (this.activeHeaderSorting instanceof TableHeaderModel) {
						this.activeHeaderSorting.loading = false;
					}

					// Display error
					if(!this.options.preventProcessHttpErrors){
						this.toastsService.showHttpError(error);
					} else {
						this.onError.emit(error);
					}
				}
			);
		} else {
			// Console warning to devs
			console.warn("simplePanelOptions is not defined.")
		}
	}

	private initialFetchRows() {
		// Must pass options
		if (this.options) {
			// has value
			if (ArrayUtility.hasValue(this.options.remoteData)) {
				// Start global loading
				this.loader.global = true;

				// Set remote data
				this.remoteDataService.setRemoteDate(this.options.remoteData);

				// Wait remote data at the same time with fetchrows
				this.remoteDataService.process().subscribe(
					() => {
						// TODO: Move this code to extra function to avoid repeat code
						// Emit event
						this.onRemoteData.emit(this.remoteDataService.getData());

						// On complete start fetch
						this.fetchRows();
					},
					() => {
						// Emit event
						this.onRemoteData.emit(this.remoteDataService.getData());

						// On complete start fetch
						this.fetchRows();
					});
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

						//Emit row changed
						this.onRowChanged.emit(foundRow);

						//Emit row updated
						this.onRowUpdated.emit(foundRow);
					} else {
						// If not exist, add it
						this.addRow(model);
					}
				} else {
					// If not updating add it
					this.addRow(model);
				}
			},
			json: json
		});
	}

	private addRow(model: DataBaseModelInterface): void {
		// Create row
		const row: TableRowModel = new TableRowModel(
			model.getId(),
			model.getReference(),
			model
		);

		// If not updating add it
		this.tableModel.addRow(row, this.tableOptions ? this.tableOptions.useUnshift : false);

		//Emit row changed
		this.onRowChanged.emit(row);

		//Emit row added
		this.onRowAdded.emit(row);
	}
}
