import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeParticipantsBracketComponent } from './three-participants-bracket.component';

describe('ThreeParticipantsBracketComponent', () => {
  let component: ThreeParticipantsBracketComponent;
  let fixture: ComponentFixture<ThreeParticipantsBracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeParticipantsBracketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeParticipantsBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
