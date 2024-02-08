import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightSelectorComponent } from './weight-selector.component';

describe('WeightSelectorComponent', () => {
  let component: WeightSelectorComponent;
  let fixture: ComponentFixture<WeightSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeightSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
