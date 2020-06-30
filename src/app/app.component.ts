import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TabModel } from 'projects/solcre-org/ng-core/src/public-api';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	form: FormGroup;
	tabs: TabModel[];
	selected: number = 1;

	constructor(
		private fb: FormBuilder
	){}

	ngOnInit(){
		this.form = this.fb.group({
			'link': this.fb.control('https://solcre.com')
		});
		this.tabs = [
			new TabModel(1, 'Tab 1', true),
			new TabModel(2, 'Tab 2'),
			new TabModel(3, 'Tab 3')
		];
	}
}
