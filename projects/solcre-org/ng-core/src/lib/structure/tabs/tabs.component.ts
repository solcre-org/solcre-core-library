import { Component, OnInit, Output, Input, EventEmitter, ViewEncapsulation } from '@angular/core';
import { TabModel } from './tab.model';

@Component({
  selector: 'ng-solcre-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TabsComponent {
	//Inputs and ouputs
	@Input() tabs: TabModel[];
	@Input() selected: number;
	@Input() withQuantities: boolean;

	@Output() onChange: EventEmitter<TabModel> = new EventEmitter<TabModel>();

	onTabClick(tab: TabModel){
		//Emit event
		this.onChange.emit(tab);

		//Set selected
		this.selected = tab.id;
	}
}
