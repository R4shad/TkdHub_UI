import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitorRegistrationComponent } from './competitor-registration.component';

describe('CompetitorRegistrationComponent', () => {
  let component: CompetitorRegistrationComponent;
  let fixture: ComponentFixture<CompetitorRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitorRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitorRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
