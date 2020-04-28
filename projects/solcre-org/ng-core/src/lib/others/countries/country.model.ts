export class CountryModel {
	constructor(
		public id: string,
		public name: string){}

	toString(){
		return this.id;
	}
}