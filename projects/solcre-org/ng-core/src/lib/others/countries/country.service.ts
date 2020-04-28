import { CountryModel } from "./country.model";
import { Countries } from "./countries";
import { Injectable } from "@angular/core";

@Injectable({
	providedIn: 'root',
})
export class CountryService {
	private countries: {};

	constructor() {
		this.countries = {};

		// Load countries
		this.loadCountries();
	}

	// Parse countries to memory
	private loadCountries(): void {
		// For ech country
		Countries.forEach((c: any) => {
			let country: CountryModel = new CountryModel(c.code, c.display);

			// Push to array
			this.countries[c.code] = country;
		});
	}

	// Find country by code
	public findCountry(code: string): CountryModel {
		let result: CountryModel = null;

		// Find
		if (this.countries[code] instanceof CountryModel) {
			result = this.countries[code];
		}

		return result;
	}

	public findCountryName(code: string): string {
		let result: string = '';

		// Find
		if (this.countries[code] instanceof CountryModel) {
			result = this.countries[code].name;
		}

		return result;
	}

	// Get all countries
	public getCountries(): CountryModel[] {
		return Object.values(this.countries);
	}

	public getCountriesSorted(): CountryModel[] {
		return this.getCountries().sort((a: CountryModel, b: CountryModel) => {
			// First sort by Y
			if (a.name < b.name) {
				return -1;
			}
			if (a.name > b.name) {
				return 1;
			}
			//No change
			return 0;
		});;
	}

	// Filter countries
	public filterContries(filter: string[]): CountryModel[] {
		let countries: CountryModel[] = [];

		// Filter
		for (let id in this.countries) {
			// Check index
			if (filter.indexOf(id) > -1) {
				countries.push(this.countries[id]);
			}
		}

		return countries;
	}
}