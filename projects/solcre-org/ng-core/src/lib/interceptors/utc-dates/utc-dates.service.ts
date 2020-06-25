import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class UtcDatesService {
	private timezone: any;

	public setTimezone(timezone: any): void {
		this.timezone = timezone;
	}

	public getTimezone(): any {
		return this.timezone;
	}
}