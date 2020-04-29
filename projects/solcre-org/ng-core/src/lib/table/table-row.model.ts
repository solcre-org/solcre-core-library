import { DataBaseModelInterface } from '../api/data-base-model.interface';
import { TableRowActionModel } from './table-row-action.model';

export class TableRowModel {
    constructor(
		public id?: number,
		public reference?: string,
        public model?: DataBaseModelInterface,
        public extraActions?: TableRowActionModel[]) {}
}