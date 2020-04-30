import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { BreadcrumbModel } from './breadcrumb.model';

@Component({
	selector: 'ng-solcre-breadcrumbs',
	templateUrl: './breadcrumbs.component.html',
	styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent {

	//Inputs
	@Input() breadcrumbs: BreadcrumbModel[];
	@Input() back: boolean;
	@Input() manualNavigate: boolean;

	//Outputs
	@Output() onBack: EventEmitter<void> = new EventEmitter();
	@Output() onNavigate: EventEmitter<string[]> = new EventEmitter();

	//Component constructor
	constructor(
		private router: Router) { }

	//Methods
	onBackState() {
		//Emit back
		this.onBack.emit();
	}

	onState(state: string[]) {
		//Manual navigate
		if (this.manualNavigate) {
			this.onNavigate.emit(state);
			return;
		}

		//Automatic navigate
		this.router.navigate(state);
	}

}
