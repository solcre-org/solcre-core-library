import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, UntypedFormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'ng-solcre-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.css'],
  host: {'class': 'component'}
})
export class InputFileComponent implements OnChanges{
	//Inputs
	@Input() fileControl: UntypedFormControl | AbstractControl | null;
	@Input() fileName: string;
	@Input() accept: string;

	//properties
	selectedFile: File;

	constructor() { }

	ngOnChanges() {
		//Try to load input value
		/*if(this.formGroup instanceof FormGroup && this.key && !this.selectedFile){
			//Get control value
			const val: string = this.formGroup.get(this.key).value;

			if(val != this.fileName){
				this.fileName = val;
			}
		}*/
	}

	//On file select
	onFileSelect(event){
		//Load selected file
		this.selectedFile =  event.target.files[0];

		//Check file
		if(this.selectedFile instanceof File){
			this.fileName = this.selectedFile.name

			//Load value to control
			this.applyFileSelected(this.selectedFile);
		} else {
			this.fileName = null;
			this.selectedFile = null;

			//Load value to control
			this.applyFileSelected(this.selectedFile);
		}
	}

	private applyFileSelected(file: File){
		if(this.fileControl instanceof UntypedFormControl){
			this.fileControl.patchValue(file);
		}
	}

}
