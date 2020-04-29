export class SimplePanelOptions {

    constructor(
		public URI: string,
		public clientCode?: string,
		public updateWithPatch?: boolean,
		public defaultQueryParams?: any
    ){}
}