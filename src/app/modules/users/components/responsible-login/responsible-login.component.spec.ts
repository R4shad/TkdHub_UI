import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibleLoginComponent } from './responsible-login.component';

describe('ResponsibleLoginComponent', () => {
  let component: ResponsibleLoginComponent;
  let fixture: ComponentFixture<ResponsibleLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponsibleLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsibleLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
