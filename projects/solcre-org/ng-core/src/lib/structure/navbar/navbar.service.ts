import { EventEmitter, Injectable } from '@angular/core';
import { MenuItemModel } from './menu-item.model';

@Injectable({
	providedIn: 'root',
})
export class NavbarService {

	public menu: MenuItemModel[];
	public onStateChange: EventEmitter<boolean> = new EventEmitter();

	public changeState(state: boolean): void {
		this.onStateChange.emit(state);
	}

	public setMenu(menu: MenuItemModel[]): void {
		this.menu = menu;
	}

	// Filter the menu with the user logged permissions
	public getFilteredMenu(): MenuItemModel[]{
		const result: MenuItemModel[] = [];

		// Load can enter to display none
		if (this.menu instanceof Array){
			this.menu.forEach((menuItem: MenuItemModel) => {
				// Has childs? filter it
				if (menuItem.childs.length){
					menuItem.canEnter = this.filterMenuRec(menuItem.childs);
				} else {
					// Calculate
					menuItem.canEnter = this.calculateCanEnter(menuItem);
				}

				// Push to menu
				result.push(menuItem);
			});
		}

		// Load menu filtered
		return result;
	}

	private filterMenuRec(menu: MenuItemModel[]): boolean{
		let childsCanEnter: boolean;

		// Filter nav
		if (menu instanceof Array){
			menu.forEach((menuItem: MenuItemModel) => {
				// Check childs
				if (menuItem.childs instanceof Array && menuItem.childs.length > 0){
					// Rec
					menuItem.canEnter = this.filterMenuRec(menuItem.childs);
				} else {
					// Calculate
					menuItem.canEnter = this.calculateCanEnter(menuItem);
				}

				// Calculate parent permissions
				childsCanEnter = (childsCanEnter === undefined && menuItem.canEnter) || menuItem.canEnter || childsCanEnter;
			});
		}
		return childsCanEnter;
	}

	private calculateCanEnter(menuItem: MenuItemModel): boolean {
		let canEnter: boolean = false;

		if (menuItem.permissions instanceof Array && menuItem.permissions.length > 0){
			// Calculate permissions
			// canEnter = this.securityService.hasMenuPermission(m.permissions);
		} else if (menuItem.permissions === null){
			// No permission needed
			canEnter = true;
		} else {
			// If no permissions hide it
			canEnter = false;
		}
		return canEnter;
	}
}
