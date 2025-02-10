import {Component, output, OutputEmitterRef} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {DropdownMultiComponent} from "../../../components/dropdown-multi/dropdown-multi.component";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {supplierStatus} from "../../../config/status-config";

@Component({
  selector: 'app-supplier-filter',
  standalone: true,
  imports: [
    AsyncPipe,
    DropdownMultiComponent,
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './supplier-filter.component.html',
  styleUrl: './supplier-filter.component.scss'
})
export class SupplierFilterComponent {
  appliedFilter:OutputEmitterRef<any> = output();
  isFilterApplied = false;
  statusList = supplierStatus;

  constructor(public fb: FormBuilder) {
  }

  form = this.fb.group({
    name: [''],
    countryOfOrigin: [''],
    status: [''],
  });

  reset() {
    this.appliedFilter.emit(null);
    this.isFilterApplied = false;
    this.form.reset();
  }

  applyFilter() {
    this.isFilterApplied = true;
    this.appliedFilter.emit(this.form.getRawValue());
  }

}
