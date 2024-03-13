import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SixteenParticipantsBracketComponent } from './sixteen-participants-bracket.component';

describe('SixteenParticipantsBracketComponent', () => {
  let component: SixteenParticipantsBracketComponent;
  let fixture: ComponentFixture<SixteenParticipantsBracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SixteenParticipantsBracketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SixteenParticipantsBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
