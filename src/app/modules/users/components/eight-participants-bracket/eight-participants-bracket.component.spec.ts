import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EightParticipantsBracketComponent } from './eight-participants-bracket.component';

describe('EightParticipantsBracketComponent', () => {
  let component: EightParticipantsBracketComponent;
  let fixture: ComponentFixture<EightParticipantsBracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EightParticipantsBracketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EightParticipantsBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
