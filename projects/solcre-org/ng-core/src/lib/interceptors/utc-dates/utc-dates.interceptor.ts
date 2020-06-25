import { Injectable } from '@angular/core';
import { 
    HttpEvent, 
    HttpInterceptor, 
    HttpHandler, 
    HttpRequest,
    HttpResponse,
	HttpParams
} from '@angular/common/http';
import * as moment from 'moment-timezone';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ArrayUtility } from '../../utilities/array.utility';
import { UtcDatesService } from './utc-dates.service';

@Injectable()
export class UtcDatesInterceptor implements HttpInterceptor {
	static DATE_FORMAT: string = "YYYY-MM-DD HH:mm:ss";
	static DATE_FORMAT_WSECONDS: string = "YYYY-MM-DD HH:mm";

	//Inject services
    constructor(
		private utcDatesService: UtcDatesService ) { }
    
    //Intercep all request method
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const isApiUrl: boolean = this.isApiUrl(req.url);
		let request: HttpRequest<any> = req;

		//Process request body and params
		if(isApiUrl){
			//Process body
			if(req.body){
				this.process(req.body, true);
			}
			//Params
			if(request.params instanceof HttpParams && request.params.keys().length > 0){
				request = this.processRequestParams(request);
			}
		}

        //Pass on the cloned request instead of the original request.
		return next.handle(request).pipe(
			tap( (response: any) =>  this.process(response.body) )
		);
	}
	
	//Helper methods
	private process(body: any, toUTC?: boolean) {
		//Check instanceof, this instanceof has readonly properties
		if(body instanceof Blob || body instanceof File){
			return;
		}

		//Do the each
		ArrayUtility.each(body, (item: any, key: string) => {
			if(typeof item === "string"){

				//Check no utc date
				if(!this.mustIgnoreNoUtcDate(body)){
					body[key] = this.checkMatches(body[key], toUTC);
				}
			} else {
				//Do recursive
				this.process(item, toUTC);
			}
		});
	}

	private processRequestParams(request: HttpRequest<any>): HttpRequest<any> {
		let newParams: HttpParams = new HttpParams();
		let param: string = null;
		
		//For each param
		ArrayUtility.each(request.params.keys(), (key: string) => {
			param = request.params.get(key);

			//Process param or push directly
			if(typeof param === "string"){
				newParams = newParams.append(key, this.checkMatches(param));
			}else {
				newParams = newParams.append(key, param);
			}
		});
		return request.clone({
			"params": newParams
		});
	}

	//Utc date to timezone date
	private utcDateToTimezoneDate(utcDate: string, format: string) : string {
		let timezoneDate: string = utcDate;

		if(this.utcDatesService.getTimezone() && utcDate){
			let momentDate: moment.Moment = moment.utc(utcDate);

			//Change toma zone and do result
			timezoneDate = momentDate
							.tz(this.utcDatesService.getTimezone())
							.format(format);
		}
		return timezoneDate;
	}

	//Timezone date to utc
	private timezoneDateToUtcDate(timezoneDate: string, format: string) : string {
		let utcDate: string = timezoneDate;

		if(this.utcDatesService.getTimezone() && timezoneDate){
			let momentDate: moment.Moment = moment.tz(timezoneDate, this.utcDatesService.getTimezone());

			//Change toma zone and do result
			utcDate = momentDate.utc().format(format);
		}
		return utcDate;
	}

	//Check is valid request
	private isApiUrl(url: string): boolean {
		return url && (url.split('/').pop().indexOf('.') === -1);
	}

	//Check matches
	private checkMatches(value: string,  toUTC?: boolean): string{
		//Check
		let matches: any[] = value.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
		let result: string = value;
				
		//Check matches
		if(matches instanceof Array){
			result = this.processMatch(result, matches[0], UtcDatesInterceptor.DATE_FORMAT, toUTC);
		} else {
			//Check matches without seconds
			matches = result.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/);
				
			//Check matches
			if(matches instanceof Array){
				result = this.processMatch(result, matches[0], UtcDatesInterceptor.DATE_FORMAT_WSECONDS, toUTC);
			}
		}

		return result;
	}	

	//Process valid match	
	private processMatch(value: string, match: string, format: string, toUTC: boolean): string{
		return value.replace(
			match, toUTC ? this.timezoneDateToUtcDate(match, format) : this.utcDateToTimezoneDate(match, format));
	}

	//Must ignore date
	private mustIgnoreNoUtcDate(obj: any): boolean{
		return false; //("isUTC" in obj) && !obj.isUTC;
	}
}