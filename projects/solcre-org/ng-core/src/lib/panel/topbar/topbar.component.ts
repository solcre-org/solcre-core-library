import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BreadcrumbModel } from '../breadcrumbs/breadcrumb.model';

@Component({
	selector: 'ng-solcre-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

	//Inputs
	@Input() breadcrumbs: BreadcrumbModel[];
	@Input() back: boolean;
	@Input() skipWrapper: boolean;
	@Input() manualNavigate: boolean;
	@Input() subtitle: string;

	//Outputs
	@Output() onBack: EventEmitter<void> = new EventEmitter();
	@Output() onNavigate: EventEmitter<string[]> = new EventEmitter();

	//Inject services
	constructor() { }

	//On component init
	ngOnInit() {

	}

	//Event emitter
	onBackEmit() {
		this.onBack.emit();
	}
	
	onNavigateEmit(args: string[]) {
		this.onNavigate.emit(args);
	}

}
