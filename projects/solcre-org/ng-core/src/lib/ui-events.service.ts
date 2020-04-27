import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class UiEventsService {
	//Events
	public externalModalStateChange: EventEmitter<boolean>;
	public internalModalStateChange: EventEmitter<boolean>;
	public popupStateChange: EventEmitter<boolean>;

	constructor(){
		//init events emitters
		this.externalModalStateChange = new EventEmitter<boolean>();
		this.internalModalStateChange = new EventEmitter<boolean>();
		this.popupStateChange = new EventEmitter<boolean>();
	}
}