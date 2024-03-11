import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiveParticipantsBracketComponent } from './five-participants-bracket.component';

describe('FiveParticipantsBracketComponent', () => {
  let component: FiveParticipantsBracketComponent;
  let fixture: ComponentFixture<FiveParticipantsBracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiveParticipantsBracketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiveParticipantsBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
