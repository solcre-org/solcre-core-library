import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { NavbarService } from './navbar.service';
import { MenuItemModel } from './menu-item.model';
import { UiEventsService } from '../../ui-events.service';

@Component({
	selector: 'ng-solcre-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
	// Outputs
	@Output() onLogoutRequested: EventEmitter<void> = new EventEmitter();

	// Menu state open| closed
	state: boolean;

	// Active menu structure
	menu: MenuItemModel[];

	// Sets the last menu active
	currentMenuId: number;

	// Set the levels actives
	activeMenulevels: any[];

	constructor(
		private router: Router,
		private navService: NavbarService,
		private uiEventsService: UiEventsService) { }

	// On component init
	ngOnInit(): void {
		// Clear vars
		this.currentMenuId = null;
		this.activeMenulevels = [];

		// Load menu structure
		this.menu = this.navService.getFilteredMenu();

		// Wait nav state change
		// this component can only open for this method
		this.navService.onStateChange.subscribe((state: boolean) => {
			// Load state
			this.state = state;

			// Clear vars
			this.currentMenuId = null;
			this.activeMenulevels = [];

			// Call ui events service to notify external modal change
			this.uiEventsService.externalModalStateChange.emit(state);
		});
	}

	// Open menu level on hover or click
	openMenuLevel(item: MenuItemModel, level: number): void {
		// Prevent can enter
		if (!item.canEnter) {
			// Clear active menu levels
			this.activeMenulevels.length = level;

			// Clear current menu id
			this.currentMenuId = null;
			return;
		}

		// Check index, is the same id? toggle menu state
		if (this.activeMenulevels[level] && this.activeMenulevels[level].id === item.id) {
			// Clear active menu levels
			this.activeMenulevels.length = level;

			// Clear current id, must hide the level
			if (this.activeMenulevels[level - 1]) {
				this.currentMenuId = this.activeMenulevels[level - 1].id;
			} else {
				this.currentMenuId = null;
			}
		} else {
			// Load current id, must show the level
			this.currentMenuId = item.id;

			// Load menu item
			this.activeMenulevels.splice(level, 0, item);

			// Clear the right menus
			this.activeMenulevels.length = level + 1;
		}
	}

	// Navigate menu
	navigateMenuItem(item: MenuItemModel): void {
		// Close modal
		this.onCloseNav();

		// Navigate
		this.router.navigate(item.action);
	}

	// When an MenuItemModel is clicked or touched (Mobile|Desktop)
	onOpenMenuItem(item: MenuItemModel, level: number, onlyNavigate?: boolean): void {
		// First of all check the action property
		// And the childs count
		if (item.canNavigate) {
			// Navigate
			this.navigateMenuItem(item);
		} else if (!onlyNavigate) {
			// Open menu level
			this.openMenuLevel(item, level);
		}
	}

	onLogout(): void {
		// Close
		this.onCloseNav();

		// Then request logout
		this.onLogoutRequested.emit();
	}

	// When the user hover an option with the mouse (Desktop)
	onHoverMenuItem(item: MenuItemModel, level: number): void {
		// Nothing to do when the item are loaded and hover again
		// Or is a child and the nav is already open
		if (item.id === this.currentMenuId || this.activeLevelIsChild(item)) {
			return;
		}

		// Check childs
		if (item.childs.length > 0) {
			// Open the option
			this.openMenuLevel(item, level);
		} else {
			// Prevent to not loaded the same item childs
			this.currentMenuId = item.id;

			// Clear next childs in case that are loaded before
			this.activeMenulevels.length = level;
		}
	}

	// Go back the menu level on mobile
	onMenuLevelBack(currentlevent: number): void {
		// Clear active menu levels
		this.activeMenulevels.length = currentlevent;

		// Clear current id, must hide the level
		if (this.activeMenulevels[currentlevent - 1]) {
			this.currentMenuId = this.activeMenulevels[currentlevent - 1].id;
		} else {
			this.currentMenuId = null;
		}
	}

	// Close the nav
	onCloseNav(): void {
		// Use setter and it emit the state change, this trigger subscribe on ngOnInit
		this.navService.changeState(false);
	}

	// When any key press
	onKeyup(event: KeyboardEvent, item: MenuItemModel, level: number, onlyNavigate: boolean): void {
		// Check key
		if (event.key === 'Enter') {
			// Is like click
			this.onOpenMenuItem(item, level, onlyNavigate);
		}
	}

	// Helper method
	private activeLevelIsChild(item: MenuItemModel): boolean {
		let isChild: boolean = false;

		// Find in childs
		if (item.childs instanceof Array && item.childs.length > 0) {
			item.childs.every((child: MenuItemModel) => {
				// Check childs
				if (child.childs.length > 0) {
					isChild = this.activeLevelIsChild(child) || isChild;
				}

				if (child.id === this.currentMenuId) {
					isChild = true;
				}
				return !isChild;
			});
		}

		return isChild;
	}

}
