import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionshipSummaryComponent } from './championship-summary.component';

describe('ChampionshipSummaryComponent', () => {
  let component: ChampionshipSummaryComponent;
  let fixture: ComponentFixture<ChampionshipSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChampionshipSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChampionshipSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
