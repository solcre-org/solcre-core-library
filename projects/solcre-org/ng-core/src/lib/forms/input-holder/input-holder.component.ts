import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'ng-solcre-input-holder',
	templateUrl: './input-holder.component.html',
	styles: ['./input-holder.component.css']
})
export class InputHolderComponent implements OnInit {
	// Inputs
	@Input() inputId: string;
	@Input() required: boolean;
	@Input() maxLength: number;
	@Input() minLength: number;
	@Input() control: FormControl;

	constructor() { }

	ngOnInit() {
	}

}
