import { Component, Output, Input, EventEmitter, ViewEncapsulation } from '@angular/core';
import { TabModel } from './tab.model';
import { ArrayUtility } from '../../utilities/array.utility';

@Component({
  selector: 'ng-solcre-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TabsComponent {
	//Inputs and ouputs
	@Input() tabs: TabModel[];
	@Input() withQuantities: boolean;

	@Output() onChange: EventEmitter<TabModel> = new EventEmitter<TabModel>();

	onTabClick(tab: TabModel){
		//Clear all previous selected
		ArrayUtility.each(this.tabs, (tab: TabModel) => {
			tab.selected = false;
		})

		//Set selected
		tab.selected = true;;

		//Emit event
		this.onChange.emit(tab);

	}
}
