import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourteenParticipantsBracketComponent } from './fourteen-participants-bracket.component';

describe('FourteenParticipantsBracketComponent', () => {
  let component: FourteenParticipantsBracketComponent;
  let fixture: ComponentFixture<FourteenParticipantsBracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourteenParticipantsBracketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourteenParticipantsBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
