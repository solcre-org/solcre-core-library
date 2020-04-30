import { TableRowModel } from './table-row.model';
import { TableRowActionStatus } from './table-row-action-status.enum';

export class TableRowActionModel {

	public disabled: boolean;
	public status: TableRowActionStatus;

	constructor(
		public key: string,
		public description?: string,
		public classes?: string,
		public callback?: (row: TableRowModel) => void
	) { }

	public execute(row: TableRowModel){
		if(this.callback) {
			this.callback(row);
		}
	}
}