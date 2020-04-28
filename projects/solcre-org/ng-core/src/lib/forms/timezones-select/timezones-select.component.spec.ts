import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimezonesSelectComponent } from './timezones-select.component';

describe('TimezonesSelectComponent', () => {
	let component: TimezonesSelectComponent;
	let fixture: ComponentFixture<TimezonesSelectComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TimezonesSelectComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TimezonesSelectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
