import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from "rxjs/operators";

import { RemoteDataModel } from './remote-data.model';
import { ApiService } from '../../../api/api.service';
import { ApiResponseModel } from '../../../api/api-response.model';
import { ArrayUtility } from '../../../utilities/array.utility';

@Injectable({
	providedIn: 'root',
})
export class RemoteDataService {
	// Models
	private remoteData: RemoteDataModel[] = [];
	private data: any = {};

	// Inject services
	constructor(
		private apiService: ApiService) { }

	// Set remote data
	public setRemoteDate(remoteData: RemoteDataModel[]): void {
		this.remoteData = remoteData;
	}

	// Get data
	public getData(key?: string): any {
		// Check key
		if (key) {
			return this.data[key];
		}
		return this.data;
	}

	// Process all remote data
	public process(): Observable<any> {
		let observables: Observable<ApiResponseModel>[] = [];

		// Iterate remote data
		ArrayUtility.each(this.remoteData, (remoteData: RemoteDataModel) => {
			// Push and fetch
			observables.push(
				this.apiService.fetchData(remoteData.uri, remoteData.queryParams).pipe(
					map((response: any) => {
						// Load data
						this.data[remoteData.key] = response;

						// Freturn normal response
						return response;
					})
				)
			)
		});

		// Return Observable fork
		return forkJoin(observables);
	}
}