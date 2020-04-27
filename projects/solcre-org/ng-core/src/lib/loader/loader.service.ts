import { EventEmitter } from '@angular/core';

export class LoaderService {

	public onOpen: EventEmitter<void> = new EventEmitter();
    public onClose: EventEmitter<void> = new EventEmitter();
  
    constructor(){
    }

	public start(){
		this.onOpen.emit();
    }
    public done() {
        this.onClose.emit();
    }
 
}