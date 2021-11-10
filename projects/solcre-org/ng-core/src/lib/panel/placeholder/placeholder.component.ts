import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslationsService } from '../../others/translations/translations.service';

@Component({
  selector: 'ng-solcre-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.css'],
  host: {'class': 'component'}
})
export class PlaceholderComponent implements OnInit {
	//Inputs
	@Input() large: boolean;
	@Input() text: string;
	@Input() editMode: boolean;
	@Input() skipAdd: boolean;

	//Outputs
	@Output() onAdd: EventEmitter<void> = new EventEmitter();

	//Models
	translations: any

	//Component constructor
	constructor( private translationsService: TranslationsService) { 
		this.translations = this.translationsService.get('placeholder');
	}

	//On component init
	ngOnInit() {
	}

	//On add click
	onAddClick(){
		//Emit event
		this.onAdd.emit();
	}
}
