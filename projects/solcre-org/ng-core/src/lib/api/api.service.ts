import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { ApiResponseModel } from "./api-response.model";
import { SolcreAuthService } from "ng-solcre-auth";
import { environment } from "../environment";
// import { FormUtility } from '../utilities/form.utility';

@Injectable({
	providedIn: "root"
})
export class ApiService {


	//Service constructor
	constructor(
		private authService: SolcreAuthService,
		private httpClient: HttpClient) { }



	//Fetch
	public fetchData(uri: string, params?: any): Observable<ApiResponseModel> {
		//Check cache of observables

		//Get options
		const httpOptions = {
			headers: new HttpHeaders({
				'Authorization': 'Bearer ' + this.getAccessToken(),
				'Accept': "application/vnd.columnis.v2+json"
			}),
			params: params
		};

		//Do request
		return this.httpClient
			.get(environment.apiURL + uri, httpOptions)
			.pipe(
				//Map response
				map((response: any) => {
					return this.parseCollectionResponse(response);
				})
			);
	}

	//Fetch
	public getObj(uri: string, id?: any): Observable<ApiResponseModel> {
		//Check cache of observables

		//Get options
		const httpOptions = {
			headers: new HttpHeaders({
				'Authorization': 'Bearer ' + this.getAccessToken(),
				'Accept': "application/vnd.columnis.v2+json"
			})
		};

		//Do request
		return this.httpClient
			.get(environment.apiURL + uri + (id ? '/' + id : ''), httpOptions)
			.pipe(
				//Map response
				map((response: any) => {
					//Return api response model
					return this.parseSingleResponse(response);
				})
			);
	}

	//Update an object using PATCH
	public partialUpdateObj(uri: string, id: any, obj: any): Observable<ApiResponseModel> {
		//Post options
		const httpOptions = {
			headers: new HttpHeaders({
				'Authorization': 'Bearer ' + this.getAccessToken(),
				'Accept': "application/vnd.columnis.v2+json"
			})
		};

		//Url
		const url: string = environment.apiURL + uri + '/' + id;

		//Do request
		return this.httpClient
			.patch(url, obj, httpOptions)
			.pipe(
				//Map response
				map((response: any) => {
					//Return api response model
					return this.parseSingleResponse(response);
				})
			);
	}

	//Delete an object using DELETE
	public deleteObj(uri: string, id?: any): Observable<boolean> {
		//Post options
		const httpOptions = {
			headers: new HttpHeaders({
				'Authorization': 'Bearer ' + this.getAccessToken(),
				'Accept': "application/vnd.columnis.v2+json"
			})
		};

		//Url
		const url: string = environment.apiURL + uri + (id ? '/' + id : '');

		//Do request
		return this.httpClient
			.delete(url, httpOptions)
			.pipe(
				//Map response
				map((response: any) => {
					//Return api response model
					return true;
				})
			);
	}
	public partialUpdateList(uri: string, data: any[]): Observable<ApiResponseModel> {
		//Post options
		const httpOptions = {
			headers: new HttpHeaders({
				'Authorization': 'Bearer ' + this.getAccessToken(),
				'Accept': "application/vnd.columnis.v2+json"
			})
		};

		//Url
		const url: string = environment.apiURL + uri;

		//Do request
		return this.httpClient
			.patch(url, data, httpOptions)
			//.retry(this.environmentService.getHttpRetryTimes())
			.pipe(
				//Map response
				map((response: any) => {
					//Return api response model
					return this.parseSingleResponse(response);
				})
			);
	}

	private getAccessToken(): string {
		if (!this.authService.getAccessToken()) {
			return;

		}
		return this.authService.getAccessToken();
	}

	//Create an object with POST
	public createObj(uri: string, obj: any): Observable<ApiResponseModel> {
		//Post options
		const httpOptions = {
			headers: new HttpHeaders({
				'Authorization': 'Bearer ' + this.getAccessToken(),
				'Accept': "application/vnd.columnis.v2+json"
			})
		};

		//Url
		const url: string = environment.apiURL + uri;

		//check form data
		// if(FormUtility.needFormData(obj)){
		// 	obj = FormUtility.jsonToFormData(obj);
		// }

		//Do request
		return this.httpClient
			.post(url, obj, httpOptions)
			.pipe(
				//.retry(this.environmentService.getHttpRetryTimes())
				map((response: any) => {
					//Return api response model
					return this.parseSingleResponse(response);
				}));
	}

	/*public downloadFile(uri: string, params: any, type: string, fileName:string ): Observable<Blob>{
		//Do request
		return this.httpClient
			.get(this.environmentService.getApiUrl() + uri, {
				headers: new HttpHeaders({
					'Authorization': 'Bearer ' + this.authService.getAccessToken().token
				}),
				params: params,
				responseType: 'blob'
			})
			//.retry(this.environmentService.getHttpRetryTimes())
			.map((response: any) => {
				//Return api response model
				return new Blob([response], {
					type: type
				});
			}).do((response: Blob) => {
				saveAs(response, fileName)
			});
	}
​
	public getObj(uri: string, id?: any): Observable<ApiResponseModel>{
		//Get options
		const httpOptions = {
			headers: new HttpHeaders({
				'Authorization': 'Bearer ' + this.authService.getAccessToken().token
			})
		};
​
		//Parse uri
		const parsedUri: string = this.environmentService.getApiUrl() + uri + ( id ? '/' + id : '' );
​
		//Do request
		return this.httpClient
			.get(parsedUri, httpOptions)
			//.retry(this.environmentService.getHttpRetryTimes())
			.map((response: any) => {
				//Return api response model
				return this.parseSingleResponse(response);
			});
	}
​
	//Save obj
	public saveObj(uri: string, obj: any): Observable<ApiResponseModel>{
		//Check object if
		if(obj.id){
			return this.updateObj(uri, obj);
		}
		return this.createObj(uri, obj);
	}
​
	//Create an object with POST
	public createObj(uri: string, obj): Observable<ApiResponseModel>{
		//Post options
		const httpOptions = {
			headers: new HttpHeaders({
				'Authorization': 'Bearer ' + this.authService.getAccessToken().token
			})
		};
​
		//Url
		const url: string = this.environmentService.getApiUrl() + uri;
​
		//check form data
		if(FormUtility.needFormData(obj)){
			obj = FormUtility.jsonToFormData(obj);
		}
​
		//Do request
		return this.httpClient
			.post(url, obj, httpOptions)
			//.retry(this.environmentService.getHttpRetryTimes())
			.map((response: any) => {
				//Return api response model
				return this.parseSingleResponse(response);
			});
	}
		*/


	//Update an object using PUT
	public updateObj(uri: string, obj: any): Observable<ApiResponseModel> {
		//Post options
		const httpOptions = {
			headers: new HttpHeaders({
				'Authorization': 'Bearer ' + this.getAccessToken(),
				'Accept': "application/vnd.columnis.v2+json"
			})
		};

		//Url
		const url: string = environment.apiURL + uri + '/' + obj.id;

		//Do request
		return this.httpClient
			.put(url, obj, httpOptions)
			.pipe(
				map((response: any) => {
					//Return api response model
					return this.parseSingleResponse(response);
				}));
	}

	/*
​
	public partialUpdateList(uri: string, data: any[]): Observable<ApiResponseModel>{
		//Post options
		const httpOptions = {
			headers: new HttpHeaders({
				'Authorization': 'Bearer ' + this.authService.getAccessToken().token
			})
		};
​
		//Url
		const url: string = this.environmentService.getApiUrl() + uri;
​
		//Do request
		return this.httpClient
			.patch(url, data, httpOptions)
			//.retry(this.environmentService.getHttpRetryTimes())
			.map((response: any) => {
				//Return api response model
				return this.parseCollectionResponse(response);
			});
	}
​
	public deleteList(uri: string, data: any): Observable<boolean>{
		//Post options
		const httpOptions = {
			headers: new HttpHeaders({
				'Authorization': 'Bearer ' + this.authService.getAccessToken().token
			}),
			body: data
		};
​
		//Url
		const url: string = this.environmentService.getApiUrl() + uri;
​
		//Do request
		return this.httpClient
			.delete(url, httpOptions)
			//.retry(this.environmentService.getHttpRetryTimes())
			.map((response: any) => {
				return true;
			});
	}
​
	*/

	//Parse collection response
	private parseCollectionResponse(response: any): ApiResponseModel {
		//Current response
		let resp: ApiResponseModel = new ApiResponseModel();

		//CHECK RESPONSE
		if (response
			&& response._embedded
			&& Object.keys(response._embedded).length > 0) {
			//load pager
			resp.pager.fromJSON(response);

			//Load data
			resp.data = response._embedded[Object.keys(response._embedded)[0]];
		} else {
			resp.data = response;
		}

		//Return api response model
		return resp;
	}

	//Parse single response
	private parseSingleResponse(response: any): ApiResponseModel {
		//Current response
		let resp: ApiResponseModel = new ApiResponseModel();

		//CHECK RESPONSE
		if (response) {
			//Load data
			resp.data = response;
		}

		//Return api response model
		return resp;
	}


}