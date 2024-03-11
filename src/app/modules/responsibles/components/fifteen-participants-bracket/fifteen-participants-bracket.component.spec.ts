import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FifteenParticipantsBracketComponent } from './fifteen-participants-bracket.component';

describe('FifteenParticipantsBracketComponent', () => {
  let component: FifteenParticipantsBracketComponent;
  let fixture: ComponentFixture<FifteenParticipantsBracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FifteenParticipantsBracketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FifteenParticipantsBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
