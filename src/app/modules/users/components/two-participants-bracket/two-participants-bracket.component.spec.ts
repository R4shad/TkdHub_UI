import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoParticipantsBracketComponent } from './two-participants-bracket.component';

describe('TwoParticipantsBracketComponent', () => {
  let component: TwoParticipantsBracketComponent;
  let fixture: ComponentFixture<TwoParticipantsBracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoParticipantsBracketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoParticipantsBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
