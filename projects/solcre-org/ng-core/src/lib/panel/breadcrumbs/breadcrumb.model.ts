export class BreadcrumbModel {
	constructor(
		public display: string,
		public state?: string[],
		public active?: boolean,
		public skipTranslate?: boolean
	){}

	toString(): string{
		return this.display;
	}
}