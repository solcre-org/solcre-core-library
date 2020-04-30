import { DataBaseModelInterface } from '../api/data-base-model.interface';

export class TableRowModel {
    constructor(
		public id?: number,
		public reference?: string,
        public model?: DataBaseModelInterface) {}
}