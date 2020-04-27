import { TableRowModel } from '../../table/table-row.model';

export class SimplePanelOptions {

    constructor(
        public URI: string,
        public tableRowModel?: TableRowModel
    ){}

    fromJSON(json: any): void {
        this.tableRowModel.id = json.id;
        for (let i in this.tableRowModel.model) {
            this.tableRowModel.model[i] = json[i];
        };
    }
}