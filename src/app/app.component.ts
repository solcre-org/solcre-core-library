import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	form: FormGroup;

	constructor(
		private fb: FormBuilder
	){}

	ngOnInit(){
		this.form = this.fb.group({
			'link': this.fb.control('https://solcre.com')
		});
	}
}
