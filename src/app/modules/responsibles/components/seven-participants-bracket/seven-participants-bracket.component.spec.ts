import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SevenParticipantsBracketComponent } from './seven-participants-bracket.component';

describe('SevenParticipantsBracketComponent', () => {
  let component: SevenParticipantsBracketComponent;
  let fixture: ComponentFixture<SevenParticipantsBracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SevenParticipantsBracketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SevenParticipantsBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
