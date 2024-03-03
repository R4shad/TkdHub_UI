import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElevenParticipantsBracketComponent } from './eleven-participants-bracket.component';

describe('ElevenParticipantsBracketComponent', () => {
  let component: ElevenParticipantsBracketComponent;
  let fixture: ComponentFixture<ElevenParticipantsBracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElevenParticipantsBracketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElevenParticipantsBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
