import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { TimezoneService } from '../../others/timezones/timezone.service';
import { TimezoneModel } from '../../others/timezones/timezone.model';

@Component({
	selector: 'ng-solcre-timezones-select',
	templateUrl: './timezones-select.component.html',
	styleUrls: ['./timezones-select.component.css']
})
export class TimezonesSelectComponent implements OnInit {
	//Inputs
	@Input() form: UntypedFormGroup;
	@Input() placeholder: string;
	@Input() hasErrors: boolean;
	@Input() controlName: string;

	// Models
	timezones: TimezoneModel[];

	// Inject services
	constructor(
		private timezoneService: TimezoneService
	) { }

	// On init
	ngOnInit() {
		// Load all countries
		this.timezones = this.timezoneService.getAllTimezones();
	}

}
