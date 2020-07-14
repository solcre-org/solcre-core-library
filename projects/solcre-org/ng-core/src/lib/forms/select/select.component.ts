import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'ng-solcre-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.css']
})
export class SelectComponent {
	//Inputs
	@Input() form: FormGroup;
	@Input() placeholder: string;
	@Input() hasErrors: boolean;
	@Input() controlName: string;
	@Input() models: any[];
	@Input() modelIdKey: string;
	@Input() modelDisplayKey: string;

	//Outputs
	@Output() onChange: EventEmitter<void> = new EventEmitter();
	
	//Events
	onModelChange(): void {
		this.onChange.emit();
	}

}
