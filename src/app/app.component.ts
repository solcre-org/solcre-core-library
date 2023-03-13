import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { DateUtility } from '@solcre-org/ng-core';
import { 
	TabModel, 
	TableModel, 
	TableHeaderModel, 
	TableRowActionModel, 
	TableRowModel, 
	SimplePanelOptions, 
	SimplePanelService,
	ApiService,
	SimplePanelRowParsingInterface,
	ApiHalPagerModel
} from 'projects/solcre-org/ng-core/src/public-api';
import { Model } from './model';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [SimplePanelService]
})
export class AppComponent implements OnInit {
	form: UntypedFormGroup;
	tabs: TabModel[];
	selected: number = 1;
	tableModel: TableModel;
	panelOptions: SimplePanelOptions;

	constructor(
		private apiService: ApiService,
		private fb: UntypedFormBuilder
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
			new TableHeaderModel('ID', 'id', false),
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

		console.log(DateUtility.validate('28/02/2022', 'DD/MM/YYYY'))
		console.log(DateUtility.validate('50/02/2022', 'DD/MM/YYYY'))
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
				'delete': false,
				'edit': false
			};
			row.options.actionsDisponibility = {
				'action': true
			}
		} else {
			row.options.actionsVisibility = {};
		}
	}

	onHalPagerChanges(event: ApiHalPagerModel): void {
		//MOdify pager total
		event.totalItems = 99;
	}
}
