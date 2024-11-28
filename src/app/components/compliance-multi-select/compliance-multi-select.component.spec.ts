import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceMultiSelectComponent } from './compliance-multi-select.component';

describe('ComplianceMultiSelectComponent', () => {
  let component: ComplianceMultiSelectComponent;
  let fixture: ComponentFixture<ComplianceMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplianceMultiSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComplianceMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
