import {
  AfterViewInit,
  Component,
  OnInit,
  output,
  OutputEmitterRef,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {DropdownMultiComponent} from "../../../components/dropdown-multi/dropdown-multi.component";
import {complianceStatus, materialStatus, supplierStatus} from "../../../config/status-config";
import {SupplierService} from "../../../services/supplier.service";
import {map, Observable} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {ToastrService} from "ngx-toastr";
import {MaterialService} from "../../../services/material.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-materials-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownMultiComponent,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './materials-filter.component.html',
  styleUrl: './materials-filter.component.scss'
})
export class MaterialsFilterComponent implements OnInit, AfterViewInit {
  appliedFilter:OutputEmitterRef<any> = output();
  isFilterApplied = false;
  statusList = materialStatus;
  complianceStatusList = complianceStatus;

  supplierList$!: Observable<{ id: string | number; name: string }[]>;
  complianceList$!: Observable<{ id: string | number; name: string }[]>;
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

  constructor(
    private activatedRoute: ActivatedRoute,
    public fb: FormBuilder,
    private supplierService: SupplierService,
    private toastr: ToastrService,
    private materialService: MaterialService) {
  }

  IsComplianceValid() {
    const regulatoryCompliance = this.form.get('regulatoryCompliance')?.value;
    const complianceStatus = this.form.get('complianceStatus')?.value;

    if (regulatoryCompliance && !complianceStatus) {
      return false;
    }

    if (!regulatoryCompliance && complianceStatus) {
      return false;
    }

    return true;
  }

  ngOnInit() {
    this.supplierList$ = this.supplierService.getAll().pipe(
      map(result => result.data.suppliers.map(item => ({
        id: item._id,
        name: item.name
      })))
    );
    this.complianceList$ = this.materialService.getAllComplianceList().pipe(
      map(result => result.data.regulations.map(item => ({
        id: item._id,
        name: item.title
      })))
    );
  }

  ngAfterViewInit() {
    this.patchFromRouter();
  }

  patchFromRouter() {
    // TODO
    const supplier = this.activatedRoute.snapshot.queryParams['supplier'];
    // this.form.patchValue({supplier: [{
    //     id:23232,
    //     name: supplier
    //   }]});
  }

  reset() {
    this.appliedFilter.emit(null);
    this.isFilterApplied = false;
    this.form.reset();
  }

  applyFilter() {
    console.log('applyFilter', this.form.getRawValue());

    this.isFilterApplied = true;
    if (this.IsComplianceValid()) {
      this.appliedFilter.emit(this.form.getRawValue());
    } else {
      this.toastr.error('Fields "regulatoryCompliance" and "complianceStatus" can be used only in pairs!')
    }

  }
}
