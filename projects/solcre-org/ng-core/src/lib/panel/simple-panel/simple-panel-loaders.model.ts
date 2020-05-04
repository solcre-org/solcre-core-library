export class SimplePanelLoadersModel {
	constructor(
		public global?: boolean,
		public pager?: boolean,
		public primaryModal?: boolean,
		public dialog?: boolean
	){}

	public clear(): void {
		this.global = false;
		this.pager = false;
		this.primaryModal = false;
		this.dialog = false;
	}

	public updateFromOtherLoader(loader: SimplePanelLoadersModel): void {
		this.global = loader.global;
		this.pager = loader.pager;
		this.primaryModal = loader.primaryModal;
		this.dialog = loader.dialog;
	}
}