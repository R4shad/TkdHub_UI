import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwelveParticipantsBracketComponent } from './twelve-participants-bracket.component';

describe('TwelveParticipantsBracketComponent', () => {
  let component: TwelveParticipantsBracketComponent;
  let fixture: ComponentFixture<TwelveParticipantsBracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwelveParticipantsBracketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwelveParticipantsBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
