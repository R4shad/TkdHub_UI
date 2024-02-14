import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupingCompetitorsComponent } from './grouping-competitors.component';

describe('GroupingCompetitorsComponent', () => {
  let component: GroupingCompetitorsComponent;
  let fixture: ComponentFixture<GroupingCompetitorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupingCompetitorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupingCompetitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
