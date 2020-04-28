import { Component, Input } from '@angular/core';
import { NavbarService } from '../navbar/navbar.service';

@Component({
	selector: 'ng-solcre-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent {
	// Inputs
	@Input() title: string;

	// Inject services
	constructor(
		private navbarService: NavbarService
	) { }

	// Open nav
	onOpen(): void {
		// Emit event
		this.navbarService.changeState(true);
	}
}
