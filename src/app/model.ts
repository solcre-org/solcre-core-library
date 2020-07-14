import { DataBaseModelInterface } from 'projects/solcre-org/ng-core/src/public-api';

export class Model implements DataBaseModelInterface {

	constructor(
		public id?: number,
		public title?: string
	){}

	getId() {
		return this.id;
	}

	getReference() {
		return this.title;
	}

	fromJSON(json: any): void {
		this.id = json.id;
		this.title = json.title;
	}
	
	toJSON() {
		return {
			"id": this.id,
			"title": this.title
		}
	}

}