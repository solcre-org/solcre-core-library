import { Component, OnInit, Input, EventEmitter, Output, TemplateRef } from '@angular/core';
import { TableModel } from './table.model';
import { TableRowModel } from './table-row.model';
import { FormGroup } from '@angular/forms';
import { DialogModel } from '../dialog/dialog.model';
import { TableHeaderModel } from './table-header.model';
import { TableSortEnum } from './table-sort.enum';
import { TableRowActionModel } from './table-row-action.model';
import { TableOptions } from './table-options.interface';

@Component({
	selector: 'ng-solcre-table',
	templateUrl: './table.component.html',
	styles: ['./table.component.css']
})
export class TableComponent implements OnInit {

	@Input() tableModel: TableModel;
	@Input() options: TableOptions;
	@Input() customTdTpl: TemplateRef<any>;

	@Output() onDelete: EventEmitter<TableRowModel> = new EventEmitter();
	@Output() onUpdate: EventEmitter<TableRowModel> = new EventEmitter();
	@Output() onSort: EventEmitter<any> = new EventEmitter();

	dialog: DialogModel;
	newprimaryForm: FormGroup;
	filteredStatus = '';
	updateGroupForm: FormGroup;

	//Sorting
	currentSorting: any = {};
	currentKeySorting: string;
	sortingDirections: any = TableSortEnum;
	
	ngOnInit() {
		// Init sorting
		this.currentSorting = {};

		// Check options
		if (!this.options) {
			this.options = {};
		}
	}

	onDeleteRow(row: TableRowModel) {
		if (row instanceof TableRowModel) {
			this.onDelete.emit(row);
		}
	}

	onConfirmDelete() {
		this.dialog.doConfirm();

	}

	onModifiersRow(row: TableRowModel) {
		if (row instanceof TableRowModel) {
			this.onUpdate.emit(row);
		}
	}

	onSortRows(column: TableHeaderModel) {
		if (column instanceof TableHeaderModel) {
			const current: string = this.currentSorting[column.key];
			this.currentSorting = {}; //Warning! remove the last sort

			//Switch between states   
			if (!current) {
				this.currentSorting[column.key] = TableSortEnum.ASC;
				this.currentKeySorting = column.key
			} else if (current === TableSortEnum.ASC) {
				this.currentSorting[column.key] = TableSortEnum.DESC;
				this.currentKeySorting = column.key
			} else {
				delete this.currentSorting[column.key];
				this.currentKeySorting = null;
			}

			//Loading
			column.sortable = true;
			column.loading = true;

			//Emit sorting
			this.onSort.emit({
				column: column,
				value: this.currentSorting[this.currentKeySorting] ? this.currentSorting[this.currentKeySorting] : null
			});
		}
	}

	onExtraActionRow(row: TableRowModel, action: TableRowActionModel) {
		action.execute(row);
	}

}
