import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SixParticipantsBracketComponent } from './six-participants-bracket.component';

describe('SixParticipantsBracketComponent', () => {
  let component: SixParticipantsBracketComponent;
  let fixture: ComponentFixture<SixParticipantsBracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SixParticipantsBracketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SixParticipantsBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
