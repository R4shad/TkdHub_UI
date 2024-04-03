import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibleRegistrationComponent } from './responsible-registration.component';

describe('ResponsibleRegistrationComponent', () => {
  let component: ResponsibleRegistrationComponent;
  let fixture: ComponentFixture<ResponsibleRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponsibleRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsibleRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
