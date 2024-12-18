import {Component, output, OutputEmitterRef} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-materials-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './materials-filter.component.html',
  styleUrl: './materials-filter.component.scss'
})
export class MaterialsFilterComponent {
  appliedFilter:OutputEmitterRef<any> = output();
  isFilterApplied = false;

  form = this.fb.group({
    // parentID: [''],
    supplier: [''],
    status: [''],
    partNumber: [''],
    countryOfOrigin: [''],
    description: [''],
    regulatoryCompliance: [''],
    complianceStatus: [''],
    componentPartNumber: ['']
  });

  constructor(public fb: FormBuilder) {
  }

  reset() {
    this.appliedFilter.emit(null);
    this.isFilterApplied = false;
    this.form.reset();
  }

  applyFilter() {
    this.isFilterApplied = true;
    console.log('applyFilter', this.form.getRawValue());
    
    this.appliedFilter.emit(this.form.getRawValue())
  }
}
