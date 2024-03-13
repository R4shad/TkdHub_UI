import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BracketViwerComponent } from './bracket-viwer.component';

describe('BracketViwerComponent', () => {
  let component: BracketViwerComponent;
  let fixture: ComponentFixture<BracketViwerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BracketViwerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BracketViwerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
