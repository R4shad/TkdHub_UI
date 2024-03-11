import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirteenParticipantsBracketComponent } from './thirteen-participants-bracket.component';

describe('ThirteenParticipantsBracketComponent', () => {
  let component: ThirteenParticipantsBracketComponent;
  let fixture: ComponentFixture<ThirteenParticipantsBracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThirteenParticipantsBracketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirteenParticipantsBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
