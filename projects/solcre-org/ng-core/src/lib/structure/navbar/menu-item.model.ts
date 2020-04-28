export class MenuItemModel {
	// Flag indicate is a link or just list childs
	public canNavigate: boolean;

	// Visibility flag
	public canEnter: boolean;

	// Skip translate pipe
	public skipTranslate: boolean;

	constructor(
		public id: number,
		public display: string,
		public icon: string,
		public action: string[],
		public permissions?: string[],
		public childs?: MenuItemModel[],
		public modal?: string
	) {
		// Load can navigate
		this.canNavigate = action instanceof Array && (!childs || !childs.length);

		// Defaults
		if (!childs) {
			this.childs = [];
		}
	}
}
