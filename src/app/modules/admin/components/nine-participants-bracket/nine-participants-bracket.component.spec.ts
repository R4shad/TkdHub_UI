import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NineParticipantsBracketComponent } from './nine-participants-bracket.component';

describe('NineParticipantsBracketComponent', () => {
  let component: NineParticipantsBracketComponent;
  let fixture: ComponentFixture<NineParticipantsBracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NineParticipantsBracketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NineParticipantsBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
