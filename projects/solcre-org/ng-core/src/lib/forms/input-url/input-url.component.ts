import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, AbstractControl } from '@angular/forms';

import { StringUtility } from '../../utilities/string.utility';
import { Subscription } from 'rxjs';

@Component({
	selector: 'ng-solcre-input-url',
	templateUrl: './input-url.component.html',
	styleUrls: ['./input-url.component.css']
})
export class InputUrlComponent implements OnInit, OnDestroy {
	//Inputs
	@Input() placeholder: string;
	@Input() control: UntypedFormControl | AbstractControl | null;
	@Input() form: UntypedFormGroup;

	//Private model
	urlForm: UntypedFormGroup;
	subscription: Subscription;

	//Inject services
	constructor(
		private fb: UntypedFormBuilder ) { }

	//On component init
	ngOnInit(): void {
		//Create form
		this.urlForm = this.fb.group({
			'prefix': this.fb.control(''),
			'url': this.fb.control('')
		});

		//Subscribe value changes
		if(this.control instanceof UntypedFormControl) {
			//Watch
			this.subscription = this.control.valueChanges.subscribe(() => {
				//persis value from control
				this.persistValue(this.control.value);
			});

			//persis value from control
			this.persistValue(this.control.value);
		}
	}

	//Custom events
	onUrlChange(){
		const prefix: string = this.urlForm.value.prefix;
		const url: string = this.urlForm.value.url;

		//Persist value if form is form group
		this.persistValue(prefix + url);
	}

	ngOnDestroy(){
		if(this.subscription instanceof Subscription){
			this.subscription.unsubscribe();
		}
	}

	//Private helper methods
	private persistValue(url: string): void {
		const urlParts: string[] = StringUtility.getUrlParts(url);
		const urlProcesed: string = urlParts[0] + urlParts[1];

		//Persist value to url form
		this.urlForm.patchValue({
			'prefix': urlParts[0],
			'url': urlParts[1]
		});

		//Patch to form
		if(this.control instanceof UntypedFormControl && (this.control.value != urlProcesed)) {
			//Control value
			this.control.patchValue(urlProcesed);
		}
	}
}