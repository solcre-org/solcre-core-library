import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplePanelComponent } from './simple-panel.component';

describe('SimplePanelComponent', () => {
  let component: SimplePanelComponent;
  let fixture: ComponentFixture<SimplePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimplePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimplePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
