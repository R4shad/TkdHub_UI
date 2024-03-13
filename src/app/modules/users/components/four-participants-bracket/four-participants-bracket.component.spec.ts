import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourParticipantsBracketComponent } from './four-participants-bracket.component';

describe('FourParticipantsBracketComponent', () => {
  let component: FourParticipantsBracketComponent;
  let fixture: ComponentFixture<FourParticipantsBracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourParticipantsBracketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourParticipantsBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
