import {Component, Input, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ModalService} from "../../../components/modal/modal.service";
import {DropdownSearchComponent} from "../../../components/dropdown-search/dropdown-search.component";
import {DropdownComponent} from "../../../components/dropdown/dropdown.component";
import {SupplierService} from "../../../services/supplier.service";
import {MaterialService} from "../../../services/material.service";
import {ToastrService} from "ngx-toastr";
import {ModalTypes} from "../../../components/modal/modal-types";
import {StatusSvgComponent} from "../../../components/status-svg/status-svg.component";
import {materialStatus} from "../../../config/status-config";
import {ComplianceComponent} from "./compliance/compliance.component";

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, DropdownSearchComponent, DropdownComponent, StatusSvgComponent, ComplianceComponent],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss'
})
export class ProductModalComponent implements OnInit, OnDestroy {
  @ViewChild(ComplianceComponent) childFormComponent!: ComplianceComponent;
  @Input() data?: any = null;
  public tabActive = 'General';
  currentID = signal(null);
  oldParentID = null; // need for back if we wanna change parent
  parentSearch = '';
  isParentListAvailable = false;
  isParentChosen: any = false;
  productForm = this.fb.group({
    parentID: [''], // need only for view partNumber + Desc
    partNumber: ['', [Validators.required]],
    description: [''],
    status: [''],
    supplier: [''],
    supplierItemNumber: [''],
    countryOfOrigin: [''],
    BOMcomponent: [''],
    category: [''],
    unitOfMeasure: [''],
    notes: [''],
    leadTime: [''],
  });

  productSearchList: any = [];
  statusDataList = materialStatus;
  availableSuppliers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private modal: ModalService,
    private supplierService: SupplierService,
    private materialService: MaterialService,
    private toastr: ToastrService
  ) {}

  close() {
    this.modal.closeModal();
  };

  uncheckRelatedParent() {
    if (this.isParentChosen) {
      this.isParentChosen = false
    };
  };

  submitModal() {
    let modalEvent = ModalTypes.NEW;

    if(this.currentID()) {
      modalEvent = ModalTypes.UPDATE;
    };

    if(this.tabActive == 'Compliance') {
      this.modal.submitModal({
        complianceList: this.childFormComponent.getComplianceMultiData(),
        tabActive: this.tabActive,
        state: this.childFormComponent.currentState(),
        form: this.childFormComponent.getForm(),
        modalData: this.data,
      }, modalEvent);
      return;
    }
    // Tab General Data
    this.modal.submitModal({
      isParentChosen: this.isParentChosen,
      oldParentID: this.oldParentID,
      id: this.data?._id ? this.data._id : null,
      form: this.productForm.getRawValue()
    }, modalEvent);
    this.productForm.markAllAsTouched();
  };

  searchParent(searchedProduct: number | string = '') {

    if (searchedProduct.toString().length < 3) {
      this.toastr.warning('too short partNumber');
      return;
    }

    this.materialService.searchByPartNumber(searchedProduct).subscribe(res => {

      if(Array.isArray(res.data) && res.data.length === 0) {
        this.toastr.warning('Can not find any material');
      }

      this.productSearchList = res.data.map(material => {
        return {
          id: material._id,
          partNumber: material.partNumber,
          description: material.description
        };
      });

      console.log('this.productSearchList', this.productSearchList)

    });
  };

  searchSupplier(search: string) {
    this.supplierService.getByName(search).subscribe(res => {
        this.availableSuppliers = res.data.map(supplier => {
          return {id: supplier._id, name: supplier.name};
        });
    });
  };

  selectParentProduct(product: any) {
    this.isParentListAvailable = false;
    this.parentSearch = '';
    this.isParentChosen = product;
  };

  selectSupplier(supplier: { id: number, name: string }) {
    this.productForm.patchValue({supplier: supplier.name})
  };

  selectStatus(data: any) {
    this.productForm.patchValue({status: data.name})
  };

  changeModalComponent(componentData: any, event: Event) {
    event.stopPropagation();
    this.rerenderAllData(componentData);
  };

  rerenderAllData(data: any) {
    this.isParentListAvailable = false;
    this.parentSearch = '';
    this.initForm(data);
    this.data = data;
    this.tabActive = 'General';
  };

  initForm(data: any) {
    this.currentID.set(data._id);

    if (data) {
      console.log('data.parentID', data.parentID);
      if (data.parentID && data.parentID.length > 0) {
        this.oldParentID = data.parentID;
        this.materialService.searchById(data.parentID).subscribe(res => {
          console.log('searchById(data.parentID) res', res);
          this.productForm.patchValue({
            parentID: res.data.material.partNumber + ' - ' + res.data.material.description
          });
        });
      }

      this.productForm.setValue({
        parentID: data.parentID,
        partNumber: data.partNumber,
        description: data.description,
        status: data.status,
        supplier: data.supplier,
        supplierItemNumber: data.supplierItemNumber,
        countryOfOrigin: data.countryOfOrigin,
        BOMcomponent: data.BOMcomponent,
        category: data.category,
        unitOfMeasure: data.unitOfMeasure,
        notes: data.notes,
        leadTime: data.leadTime,
      });

      // this.setStatus(data.status);
    };
  };

  setStatus(status: any) {
    return this.statusDataList.find(data => data.name === status);
  }

  supplierChange(event: any){
    // todo set validation for invalid
  }

  ngOnInit() {
    if (!this.data) {
      return
    };
    this.initForm(this.data);
  }

  ngOnDestroy() {
    console.log('ngOnDestroy product modal')
  }
}
