export class TableHeaderModel {
    constructor(
        public display: string,
        public key: string,
        public sortable?: boolean,
        public loading?: boolean
    ) { }

}