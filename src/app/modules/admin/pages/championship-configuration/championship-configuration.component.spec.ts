import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionshipConfigurationComponent } from './championship-configuration.component';

describe('ChampionshipConfigurationComponent', () => {
  let component: ChampionshipConfigurationComponent;
  let fixture: ComponentFixture<ChampionshipConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChampionshipConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChampionshipConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
