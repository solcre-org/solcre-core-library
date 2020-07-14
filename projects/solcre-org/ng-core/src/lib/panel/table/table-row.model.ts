import { DataBaseModelInterface } from '../../api/data-base-model.interface';
import { TableRowOptions } from './table-row-options.interface';

export class TableRowModel {
    constructor(
		public id?: number,
		public reference?: string,
		public model?: DataBaseModelInterface,
		public options?: TableRowOptions ) {
			this.options = options ? options : {};
		}
}