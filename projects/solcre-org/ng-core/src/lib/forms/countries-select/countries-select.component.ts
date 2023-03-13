import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { CountryService } from '../../others/countries/country.service';
import { CountryModel } from '../../others/countries/country.model';


@Component({
	selector: 'ng-solcre-countries-select',
	templateUrl: './countries-select.component.html',
	styleUrls: ['./countries-select.component.css']
})
export class CountriesSelectComponent implements OnInit {
	//Inputs
	@Input() form: UntypedFormGroup;
	@Input() placeholder: string;
	@Input() hasErrors: boolean;
	@Input() controlName: string;

	// Models
	countries: CountryModel[];

	// Inject services
	constructor(
		private countryService: CountryService) { }

	// On init
	ngOnInit() {
		// Load all countries
		this.countries = this.countryService.getCountries();
	}
}
