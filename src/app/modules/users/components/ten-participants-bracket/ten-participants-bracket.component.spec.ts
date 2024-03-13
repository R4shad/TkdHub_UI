import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenParticipantsBracketComponent } from './ten-participants-bracket.component';

describe('TenParticipantsBracketComponent', () => {
  let component: TenParticipantsBracketComponent;
  let fixture: ComponentFixture<TenParticipantsBracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenParticipantsBracketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenParticipantsBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
