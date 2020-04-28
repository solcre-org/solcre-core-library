import { EventEmitter, Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";

import { ToastModel } from "./toast.model";
import { ApiErrorModel } from '../../api/api-error.model';
import { ToastStatus } from './toast-status.enum';
import { ToastModes } from './toast-modes.enum';
import { ToastPositions } from './toast-position.enum';
import { ErrorUtility } from '../../utilities/error.utility';

@Injectable({
	providedIn: 'root',
})
export class ToastsService {
	//Toasts queue
	private toastsQueue: ToastModel[];

	//Auto hide timeout timeing
	static AUTO_HDE_TIMEOUT: number = 5000;

	//Event emitter when the toasts changes
	public toastQueueChange: EventEmitter<ToastModel[]>;

	//Service queue
	constructor() {
		//Init service
		this.toastsQueue = [];
		this.toastQueueChange = new EventEmitter<ToastModel[]>();
	}

	//Push item to queue
	addToast(toast: ToastModel): void {
		//Check similar toasts
		if (!this.similarToastExist(toast)) {
			//Auto close queue
			toast.timeoutInstance = setTimeout(() => {
				//Close it
				this.removeToast(toast);
			}, ToastsService.AUTO_HDE_TIMEOUT);

			//Add item to beginning of array
			this.toastsQueue.unshift(toast);

			//Trigger toast queue change and return a copy
			this.toastQueueChange.emit(this.toastsQueue.slice(0));

			//Show toast with timeout
			setTimeout(() => {
				toast.show = true;
			});
		}
	}

	//Helper metods
	addSuccess(message: string, position?: ToastPositions) {
		this.addToast(new ToastModel(
			position ? position : ToastPositions.TOP,
			ToastStatus.SUCCESS,
			ToastModes.NORMAL,
			true,
			message)
		);
	}
	addWarning(message: string, position?: ToastPositions, params?: any) {
		this.addToast(new ToastModel(
			position ? position : ToastPositions.TOP,
			ToastStatus.WARNING,
			ToastModes.NORMAL,
			true,
			message,
			params)
		);
	}
	addInfo(message: string, position?: ToastPositions) {
		this.addToast(new ToastModel(
			position ? position : ToastPositions.TOP,
			ToastStatus.INFORMATION,
			ToastModes.NORMAL,
			true,
			message)
		);
	}
	addError(message: string, position?: ToastPositions) {
		this.addToast(new ToastModel(
			position ? position : ToastPositions.TOP,
			ToastStatus.ERROR,
			ToastModes.NORMAL,
			true,
			message)
		);
	}

	addNotLoading(message: string, position?: ToastPositions, callback?: Function) {
		let toast: ToastModel = new ToastModel(
			position ? position : ToastPositions.TOP,
			ToastStatus.NOT_LOADING,
			ToastModes.FILLED,
			true,
			message);

		//Load callback
		toast.callback = callback;

		this.addToast(toast);
	}
	showHttpError(error: HttpErrorResponse, position?: ToastPositions) {
		let httpError: ApiErrorModel = ErrorUtility.parseHttpError(error);

		//Add toast error
		this.addToast(new ToastModel(
			position ? position : ToastPositions.TOP,
			ToastStatus.ERROR,
			ToastModes.NORMAL,
			true,
			httpError.message,
			httpError.params)
		);
	}

	//remove item to queue
	removeToast(toast: ToastModel): void {
		let found: boolean = false;
		let foundIndex: number = -1;

		//find model and remove it from array
		this.toastsQueue.every((t: ToastModel, index: number) => {
			found = (t.id === toast.id);

			//Check found to remove it
			if (found) {
				//Cancel timeout
				clearTimeout(t.timeoutInstance);

				//Load index
				foundIndex = index;
			}

			return !found;
		});

		//Check found index
		if (foundIndex > -1) {
			//Hide
			toast.show = false;

			//Remove with timeout
			setTimeout(() => {
				this.toastsQueue.splice(foundIndex, 1);

				//Trigger toast queue changes and return a copy
				this.toastQueueChange.emit(this.toastsQueue.slice(0));
			}, 300)
		}
	}

	//Helper method
	private similarToastExist(toast: ToastModel): boolean {
		let exist: boolean = false;

		//find toast
		this.toastsQueue.every((t: ToastModel) => {
			//Compare toast
			exist = t.position === toast.position &&
				t.mode === toast.mode &&
				t.status === toast.status &&
				t.text === toast.text;
			return !exist;
		});

		return exist;
	}

}