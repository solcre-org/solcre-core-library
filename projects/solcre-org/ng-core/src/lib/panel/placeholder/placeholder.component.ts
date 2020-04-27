import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styles: ['./placeholder.component.css'],
  host: {'class': 'component'}
})
export class PlaceholderComponent implements OnInit {
	//Inputs
	@Input() large: boolean;
	@Input() text: string;
	@Input() editMode: boolean;

	//Outputs
	@Output() onAdd: EventEmitter<void> = new EventEmitter();

	//Component constructor
	constructor() { }

	//On component init
	ngOnInit() {
	}

	//On add click
	onAddClick(){
		//Emit event
		this.onAdd.emit();
	}
}
