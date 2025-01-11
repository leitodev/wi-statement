import {Component, OnInit, output, OutputEmitterRef} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {DropdownMultiComponent} from "../../../components/dropdown-multi/dropdown-multi.component";
import {materialStatus} from "../../../config/status-config";
import {SupplierService} from "../../../services/supplier.service";
import {map} from "rxjs";

@Component({
  selector: 'app-materials-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownMultiComponent
  ],
  templateUrl: './materials-filter.component.html',
  styleUrl: './materials-filter.component.scss'
})
export class MaterialsFilterComponent implements OnInit {
  appliedFilter:OutputEmitterRef<any> = output();
  isFilterApplied = false;

  statusList = materialStatus;

  form = this.fb.group({
    // parentID: [''],
    supplier: [''],
    status: [[]],
    partNumber: [''],
    countryOfOrigin: [''],
    description: [''],
    regulatoryCompliance: [''],
    complianceStatus: [''],
    componentPartNumber: ['']
  });

  constructor(public fb: FormBuilder, private supplierService: SupplierService) {
  }

  ngOnInit() {
    this.supplierService.getAll().pipe(
      map(result => result.data.suppliers.map(item => ({
        id: item._id,
        name: item.name
      })))
    ).subscribe(res => {
      console.log('get all prepared suppliers', res);
    });
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
