import { Injectable, EventEmitter } from "@angular/core";

import { TableRowModel } from '../table/table-row.model';
import { SimplePanelLoadersModel } from './simple-panel-loaders.model';

@Injectable()
export class SimplePanelService {
	// Event Emitters
	private onRefreshRows: EventEmitter<any> = new EventEmitter();
	private onAddRow: EventEmitter<void> = new EventEmitter();
	private onEditRow: EventEmitter<TableRowModel> = new EventEmitter();
	private onDeleteRow: EventEmitter<TableRowModel> = new EventEmitter();
	private onChangeLoader: EventEmitter<SimplePanelLoadersModel> = new EventEmitter();

	// Service constructor
	constructor() { }

	// Getters
	public getOnRefreshRows(): EventEmitter<any> {
		return this.onRefreshRows;
	}
	public getOnAddRow(): EventEmitter<void> {
		return this.onAddRow;
	}
	public getOnEditRow(): EventEmitter<TableRowModel> {
		return this.onEditRow;
	}
	public getOnDeleteRow(): EventEmitter<TableRowModel> {
		return this.onDeleteRow;
	}
	public getOnChangeLoader(): EventEmitter<SimplePanelLoadersModel> {
		return this.onChangeLoader;
	}

	// Triggers
	public triggerOnRefreshRows(params: any): void {
		this.onRefreshRows.emit(params);
	}
	public triggerOnAddRow(): void {
		this.onAddRow.emit();
	}
	public triggerOnEditRow(row: TableRowModel): void {
		this.onEditRow.emit(row);
	}
	public triggerOnDeleteRow(row: TableRowModel): void {
		this.onDeleteRow.emit(row);
	}
	public triggerOnChangeLoader(loader: SimplePanelLoadersModel): void {
		this.onChangeLoader.emit(loader);
	}

}