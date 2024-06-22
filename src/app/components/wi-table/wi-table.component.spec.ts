import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WiTableComponent } from './wi-table.component';

describe('WiTableComponent', () => {
  let component: WiTableComponent;
  let fixture: ComponentFixture<WiTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WiTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
