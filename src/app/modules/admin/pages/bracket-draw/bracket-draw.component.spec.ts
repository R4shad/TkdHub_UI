import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BracketDrawComponent } from './bracket-draw.component';

describe('BracketDrawComponent', () => {
  let component: BracketDrawComponent;
  let fixture: ComponentFixture<BracketDrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BracketDrawComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BracketDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
