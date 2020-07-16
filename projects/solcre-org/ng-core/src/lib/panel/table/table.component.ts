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
	@Input() currentSorting: any;
	@Input() currentKeySorting: string;

	@Output() onDelete: EventEmitter<TableRowModel> = new EventEmitter();
	@Output() onUpdate: EventEmitter<TableRowModel> = new EventEmitter();
	@Output() onSort: EventEmitter<any> = new EventEmitter();

	dialog: DialogModel;
	newprimaryForm: FormGroup;
	filteredStatus = '';
	updateGroupForm: FormGroup;

	//Sorting
	sortingDirections: any = TableSortEnum;
	
	ngOnInit() {
		// Init sorting
		if(!this.currentSorting){
			this.currentSorting = {};
		}

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
		if (column instanceof TableHeaderModel && (column.sortable || column.sortable == undefined) ) {
			const current: string = this.currentSorting[column.key];
			const currentSorting: any = {}; //Warning! remove the last sort

			//Switch between states   
			if (!current) {
				currentSorting[column.key] = TableSortEnum.ASC;
			} else if (current === TableSortEnum.ASC) {
				currentSorting[column.key] = TableSortEnum.DESC;
			}

			//Loading
			column.loading = true;

			//Emit sorting
			this.onSort.emit({
				column: column,
				value: currentSorting[column.key] ? currentSorting[column.key] : null
			});
		}
	}

	onExtraActionRow(row: TableRowModel, action: TableRowActionModel) {
		action.execute(row);
	}

}
