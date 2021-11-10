import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { TranslationsService } from '../../others/translations/translations.service';

@Component({
	selector: 'ng-solcre-input-holder',
	templateUrl: './input-holder.component.html',
	styleUrls: ['./input-holder.component.css']
})
export class InputHolderComponent {
	// Inputs
	@Input() inputId: string;
	@Input() required: boolean;
	@Input() maxLength: number;
	@Input() minLength: number;
	@Input() control: FormControl | AbstractControl | null;

	//Models
	translations: any;

	constructor(private translationsService: TranslationsService) { 
		this.translations = this.translationsService.get('inputHolder');
	}
}
