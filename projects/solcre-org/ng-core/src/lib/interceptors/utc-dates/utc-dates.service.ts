import { Injectable } from '@angular/core';
import { ArrayUtility } from '../../utilities/array.utility';

@Injectable({
	providedIn: 'root'
})
export class UtcDatesService {
	private timezone: any;
	private ignoredURIs: any[];

	public setTimezone(timezone: any): void {
		this.timezone = timezone;
	}

	public getTimezone(): any {
		return this.timezone;
	}

	public setIgnoredURIs(ignoredURIs: any[]): void {
		this.ignoredURIs = ignoredURIs;
	}

	public getIgnoredURIs(): any[] {
		return this.ignoredURIs;
	}

	public checkIgnoredURI(uri: string): boolean {
		let ignored: boolean = false;

		//Iterate each ignored uri
		ArrayUtility.each(this.ignoredURIs, (ignoredURI: any) => {
			if(ignoredURI instanceof RegExp){
				ignored = ignored || !!uri.match(ignoredURI); 
			} else if(ignoredURI == uri){
				ignored = true;
			}
		});
		return ignored;
	}

	public checkIgnoredURIFromURL(url: string): boolean {
		if(!url) return;
		let urlMatch: any = url.match(/.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/);
		return urlMatch ? this.checkIgnoredURI(urlMatch[1]) : false;
	}
}