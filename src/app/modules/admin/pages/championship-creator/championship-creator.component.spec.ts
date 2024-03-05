import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionshipCreatorComponent } from './championship-creator.component';

describe('ChampionshipCreatorComponent', () => {
  let component: ChampionshipCreatorComponent;
  let fixture: ComponentFixture<ChampionshipCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChampionshipCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChampionshipCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
