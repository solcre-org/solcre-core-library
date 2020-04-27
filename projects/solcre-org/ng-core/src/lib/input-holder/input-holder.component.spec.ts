import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputHolderComponent } from './input-holder.component';

describe('InputHolderComponent', () => {
  let component: InputHolderComponent;
  let fixture: ComponentFixture<InputHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
