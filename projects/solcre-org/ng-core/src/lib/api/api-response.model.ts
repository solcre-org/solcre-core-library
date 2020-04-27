import { ApiHalPagerModel } from "./api-hal-pager.model";

export class ApiResponseModel {
	public pager: ApiHalPagerModel;

	constructor(
		public data?: any) {
		//Defaults
		this.pager = new ApiHalPagerModel();
	}

	public hasCollectionResponse(): boolean {
		return (this.data instanceof Array && this.data.length > 0);
	}

	public hasSingleResponse(): boolean {
		return (this.data && this.data.id);
	}
}