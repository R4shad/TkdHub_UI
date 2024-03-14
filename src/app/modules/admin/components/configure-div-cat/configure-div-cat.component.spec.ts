import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureDivCatComponent } from './configure-div-cat.component';

describe('ConfigureDivCatComponent', () => {
  let component: ConfigureDivCatComponent;
  let fixture: ComponentFixture<ConfigureDivCatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureDivCatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureDivCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
