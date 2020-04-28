import { ToastPositions } from './toast-position.enum';
import { ToastStatus } from './toast-status.enum';
import { ToastModes } from './toast-modes.enum';
import { StringUtility } from '../../utilities/string.utility';

export class ToastModel {
	//Generated id
	public id: string;

	//Timeout instance id
	public timeoutInstance: any;

	//Show flag
	public show: boolean = false;

	//Callback
	public callback: Function;

	constructor(
		public position: ToastPositions,
		public status: ToastStatus,
		public mode: ToastModes,
		public withIcon: boolean,
		public text: string,
		public params?: any){
			//Generate id
			this.id = StringUtility.randomString();
		}
	
	//Do callback
	public doCallback(){
		if(this.callback){
			this.callback();
		}
	}
}