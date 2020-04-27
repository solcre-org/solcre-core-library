import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { ApiHalPagerModel } from '../api-hal-pager.model';

@Component({
	selector: 'app-pager',
	templateUrl: './pager.component.html',
	styles: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {
	//Inputs
	@Input() pager: ApiHalPagerModel;
	@Input() loading: boolean;

	//Outputs
	@Output() onChange: EventEmitter<number> = new EventEmitter<number>();
	
	//Properties
	first: number;
	last: number;
	current: number;
	range: number[];

	//Constructor
	constructor() { }

	//On init component
	ngOnInit() {
		//Load from pager
		this.init();
	}

	//On prev arrow clicked
	onPrev() {
		//Check current
		if (this.current != this.first) {
			//Decrease
			this.current--;

			//Generate range angain
			this.range = this.generateRange(this.current, this.last);

			//Trigger
			this.onChange.emit(this.current);
		}
	}
	onNext() {
		//Check current
		if (this.current != this.last) {
			//Increase
			this.current++;
			//Generate range angain
			this.range = this.generateRange(this.current, this.last);

			//Trigger
			this.onChange.emit(this.current);
		}
	}
	onPage(page: number) {
		//Check current
		if (this.current != page) {
			//Set
			this.current = page;

			//Generate range angain
			this.range = this.generateRange(this.current, this.last);

			//Trigger
			this.onChange.emit(this.current);
		}
	}

	//Helper methods
	private generateRange(current: number, last: number): number[] {
		//Init vars
		//SOURCE: https://gist.github.com/kottenator/9d936eb3e4e3c3e02598
		const delta: number = 2;
		const left: number = current - delta;
		const right: number = current + delta + 1;
		let range: number[] = [];
		let rangeWithDots: number[] = [];
		let l: number;

		//Generate range
		for (let i = 1; i <= last; i++) {
			if (i == 1 || i == last || i >= left && i < right) {
				range.push(i);
			}
		}

		//Load dots (use the 0 value) using range generated in previous step
		for (let i of range) {
			if (l) {
				if (i - l === 2) {
					rangeWithDots.push(l + 1);
				} else if (i - l !== 1) {
					rangeWithDots.push(0);
				}
			}
			rangeWithDots.push(i);
			l = i;
		}

		return rangeWithDots;
	}

	private init() {
		//Load from pager
		if (this.pager instanceof ApiHalPagerModel) {
			//First is allways 1
			this.first = 1;
			this.last = this.pager.totalPages;
			this.current = this.pager.currentPage;
			this.range = this.generateRange(this.current, this.last);
		}
	}

}
