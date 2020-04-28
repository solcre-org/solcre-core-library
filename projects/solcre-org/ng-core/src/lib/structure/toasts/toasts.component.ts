import { Component, OnInit, Input } from '@angular/core';
import { ToastModel } from './toast.model';
import { ToastsService } from './toasts.service';
import { ToastPositions } from './toast-position.enum';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.css'],
  host: {'class': 'component'}
})
export class ToastsComponent implements OnInit {
	//Properties
	toasts:ToastModel[];

	//Inputs
	@Input() position: string;

	constructor(
		private toastsService: ToastsService) { 
		//Init propoerties
		this.toasts = [];
	}

	ngOnInit() {
		//Default container position
		if(!this.position){
			this.position = ToastPositions.TOP;
		}

		//Watch toasts changes
		this.toastsService.toastQueueChange.subscribe((toasts: ToastModel[]) => {
			this.toasts = toasts.filter((t: ToastModel) => {
				return t.position === this.position;
			});
		});
	}

	//Methods
	onCloseToast(toast: ToastModel){
		this.toastsService.removeToast(toast);
	}

	onRefreshToast(toast: ToastModel){
		//Do callback
		toast.doCallback();

		//Close toast
		this.onCloseToast(toast);
	}

	onActionToast(toast: ToastModel){
		//Do callback
		toast.doCallback();

		//Close toast
		this.onCloseToast(toast);
	}

}
