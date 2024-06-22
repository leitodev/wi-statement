import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartManagementComponent } from './part-management.component';

describe('StatementListComponent', () => {
  let component: PartManagementComponent;
  let fixture: ComponentFixture<PartManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
