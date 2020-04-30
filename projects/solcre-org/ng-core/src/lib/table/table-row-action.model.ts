import { TableRowModel } from './table-row.model';

export class TableRowActionModel {

	public disabled?: boolean;

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