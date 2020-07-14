import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { 
	TabModel, 
	TableModel, 
	TableHeaderModel, 
	TableRowActionModel, 
	TableRowModel, 
	SimplePanelOptions, 
	SimplePanelService,
	ApiService,
	SimplePanelRowParsingInterface
} from 'projects/solcre-org/ng-core/src/public-api';
import { Model } from './model';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [SimplePanelService]
})
export class AppComponent implements OnInit {
	form: FormGroup;
	tabs: TabModel[];
	selected: number = 1;
	tableModel: TableModel;
	panelOptions: SimplePanelOptions;

	constructor(
		private apiService: ApiService,
		private fb: FormBuilder
	){}

	ngOnInit(){
		//Init api service
		this.apiService.setConfig({
			apiUrl: ''
		});

		//Init
		this.form = this.fb.group({
			'link': this.fb.control('https://solcre.com')
		});
		this.tabs = [
			new TabModel(1, 'Tab 1', true),
			new TabModel(2, 'Tab 2'),
			new TabModel(3, 'Tab 3')
		];
		//Create model
		this.tableModel = new TableModel([
			new TableHeaderModel('ID', 'id'),
			new TableHeaderModel('TITLE', 'title'),
		], 
		[
			// Extra actions
			new TableRowActionModel('action', 'Help text', 'icon-widget-headcount', (row: TableRowModel) => {
				console.log('action');
			})
		]);

		// Load simple panel options
		this.panelOptions = {
			URI: '/assets/db.json',
			title: "Title"
		};
	}

	onParseModel(arg: SimplePanelRowParsingInterface): void {
		//Get each row from simple panel
		const model: Model = new Model();
		model.fromJSON(arg.json);

		// Complete observable
		arg.callback(model);
	}

	onRowChanged(row: TableRowModel){
		if(row.model.getId() === 2) {
			row.options.actionsVisibility = {
				'action': false,
				'delete': false,
				'edit': false
			}
		} else {
			row.options.actionsVisibility = {};
		}
	}
}
