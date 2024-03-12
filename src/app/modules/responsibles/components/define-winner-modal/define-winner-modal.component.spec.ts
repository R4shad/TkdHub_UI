import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineWinnerModalComponent } from './define-winner-modal.component';

describe('DefineWinnerModalComponent', () => {
  let component: DefineWinnerModalComponent;
  let fixture: ComponentFixture<DefineWinnerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefineWinnerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineWinnerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
