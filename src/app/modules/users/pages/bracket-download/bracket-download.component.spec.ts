import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BracketDownloadComponent } from './bracket-download.component';

describe('BracketDownloadComponent', () => {
  let component: BracketDownloadComponent;
  let fixture: ComponentFixture<BracketDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BracketDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BracketDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
