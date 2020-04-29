export interface DataBaseModelInterface{
	getId(): any;
	getReference(): any;
	fromJSON(json: any): void;
	toJSON(): any
}
