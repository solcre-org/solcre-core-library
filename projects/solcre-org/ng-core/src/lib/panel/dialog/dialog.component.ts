import { OnInit, Component, Input } from '@angular/core';
import { DialogModel } from './dialog.model';
import { DialogService } from './dialog.service';


@Component({
  selector: 'ng-solcre-dialog',
  templateUrl: './dialog.component.html',
  styles: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
	//Models
	model: DialogModel;
	isCancel: boolean;
	@Input() isActive: boolean;
	@Input() loading: boolean;
	//Inject services
	constructor(
		private dialogService: DialogService
	) { }

	//On component init
	ngOnInit() {
		//Watch on open
		this.dialogService.onOpen.subscribe((model: DialogModel) => {
			this.model = model;
			if (this.model.confirmCallback) {
				this.isCancel = true;
			} else {
				this.isCancel = false;
			}
			//Open
      		this.isActive = true;
		})

		this.dialogService.onClose.subscribe(() => {
			this.isActive = false;
			this.loading = false;
		})
	}

	//Custom events
	onConfirm(){
		// Close
		if (!this.model.confirmCallback) {
			this.isActive = false;
		}

		if(this.model instanceof DialogModel){
			this.model.doConfirm();
		}
	}

	onCancel(){
		this.isActive = false;
	}

}
