import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { ApiResponseModel } from "./api-response.model";
import { ApiConfigInterface } from './api-config.interface';
import { FormUtility } from '../utilities/form.utility';

@Injectable({
	providedIn: "root"
})
export class ApiService {
	// Models
	private accessToken: string;
	private config: ApiConfigInterface;

	//Service constructor
	constructor(
		private httpClient: HttpClient) { 
		this.config = {};
	}

	//Setters
	public setAccessToken(accessToken: string): void {
		this.accessToken = accessToken;
	}

	public setConfig(config: ApiConfigInterface): void {
		this.config = config;
	}

	//Fetch
	public fetchData(uri: string, params?: any): Observable<ApiResponseModel> {
		//Header json
		const headers: any = {}

		//Check access token to add access token header
		if(this.accessToken){
			headers['Authorization'] = 'Bearer ' + this.accessToken;
		}

		//Get options
		const httpOptions = {
			headers: new HttpHeaders(headers),
			params: params
		};

		//Do request
		return this.httpClient
			.get(this.config.apiUrl + uri, httpOptions)
			.pipe(
				//Map response
				map((response: any) => {
					return this.parseCollectionResponse(response);
				})
			);
	}

	//Fetch
	public getObj(uri: string, id?: any): Observable<ApiResponseModel> {
		//Header json
		const headers: any = {}

		//Check access token to add access token header
		if(this.accessToken){
			headers['Authorization'] = 'Bearer ' + this.accessToken;
		}

		//Get options
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};

		//Do request
		return this.httpClient
			.get(this.config.apiUrl + uri + (id ? '/' + id : ''), httpOptions)
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
		//Header json
		const headers: any = {}

		//Check access token to add access token header
		if(this.accessToken){
			headers['Authorization'] = 'Bearer ' + this.accessToken;
		}

		//Post options
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};

		//Url
		const url: string = this.config.apiUrl + uri + '/' + id;

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
		//Header json
		const headers: any = {}

		//Check access token to add access token header
		if(this.accessToken){
			headers['Authorization'] = 'Bearer ' + this.accessToken;
		}

		//Post options
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};

		//Url
		const url: string = this.config.apiUrl + uri + (id ? '/' + id : '');

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
		//Header json
		const headers: any = {}

		//Check access token to add access token header
		if(this.accessToken){
			headers['Authorization'] = 'Bearer ' + this.accessToken;
		}

		//Post options
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};

		//Url
		const url: string = this.config.apiUrl + uri;

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

	//Create an object with POST
	public createObj(uri: string, obj: any): Observable<ApiResponseModel> {
		//Header json
		const headers: any = {}

		//Check access token to add access token header
		if(this.accessToken){
			headers['Authorization'] = 'Bearer ' + this.accessToken;
		}

		//Post options
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};

		//Url
		const url: string = this.config.apiUrl + uri;

		//check form data
		if(FormUtility.needFormData(obj)){
		 	obj = FormUtility.jsonToFormData(obj);
		}

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

	//Update an object using PUT
	public updateObj(uri: string, id: any, obj: any): Observable<ApiResponseModel> {
		//Header json
		const headers: any = {}

		//Check access token to add access token header
		if(this.accessToken){
			headers['Authorization'] = 'Bearer ' + this.accessToken;
		}

		//Post options
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};

		//Url
		const url: string = this.config.apiUrl + uri + '/' + id;

		//check form data
		if(FormUtility.needFormData(obj)){
			obj = FormUtility.jsonToFormData(obj);
	   }

		//Do request
		return this.httpClient
			.put(url, obj, httpOptions)
			.pipe(
				map((response: any) => {
					//Return api response model
					return this.parseSingleResponse(response);
				}));
	}

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