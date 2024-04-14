import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserPasswordComponent } from './create-user-password.component';

describe('CreateUserPasswordComponent', () => {
  let component: CreateUserPasswordComponent;
  let fixture: ComponentFixture<CreateUserPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUserPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
