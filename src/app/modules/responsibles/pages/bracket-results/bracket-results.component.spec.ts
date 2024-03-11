import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BracketResultsComponent } from './bracket-results.component';

describe('BracketResultsComponent', () => {
  let component: BracketResultsComponent;
  let fixture: ComponentFixture<BracketResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BracketResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BracketResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
