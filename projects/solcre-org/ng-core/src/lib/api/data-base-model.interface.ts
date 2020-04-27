export interface DataBaseModelInterface{
	getId(): any;
	fromJSON(json: any): void;
	toJSON(): any
}
