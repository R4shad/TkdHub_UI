import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitorViewComponent } from './competitor-view.component';

describe('CompetitorViewComponent', () => {
  let component: CompetitorViewComponent;
  let fixture: ComponentFixture<CompetitorViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitorViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
