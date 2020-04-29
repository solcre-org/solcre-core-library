import { Pipe, PipeTransform } from '@angular/core';

import { CountryService } from '../country.service';

@Pipe({
	name: 'countryName'
})
export class CountryNamePipe implements PipeTransform {
	constructor(
		private countryService: CountryService
	) { }

	transform(value: string): string {
		let countryName: string = '';

		if (value) {
			countryName = this.countryService.findCountryName(value);
		}
		return countryName;
	}

}
