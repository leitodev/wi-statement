import {Component, Input, OnInit, signal} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ModalService} from "../../../components/modal/modal.service";
import {DropdownSearchComponent} from "../../../components/dropdown-search/dropdown-search.component";
import {DropdownComponent} from "../../../components/dropdown/dropdown.component";
import {MockDataService} from "../../../services/mock-data.service";
import {SupplierService} from "../../../services/supplier.service";
import {MaterialService} from "../../../services/material.service";
import {ToastrService} from "ngx-toastr";
import {ModalEventType} from "../../../components/modal/modal-event-type";
import {StatusSvgComponent} from "../../../components/status-svg/status-svg.component";

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, DropdownSearchComponent, DropdownComponent, StatusSvgComponent],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss'
})
export class ProductModalComponent implements OnInit {
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
    supplier: ['']
  });

  productSearchList: any = [];
  statusDataList = this.mockDataService.statusDataList;
  availableSuppliers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private modal: ModalService,
    private mockDataService: MockDataService,
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
    let modalEvent = ModalEventType.NEW;

    if (this.currentID()) {
      modalEvent = ModalEventType.UPDATE;
    };

    this.modal.submitModal({
      isParentChosen: this.isParentChosen,
      oldParentID: this.oldParentID,
      id: this.data?._id ? this.data._id : null,
      form: this.productForm.getRawValue()
    }, modalEvent);
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
    console.log('selectParentProduct [product]', product);
    // product.id 66eaf395d7a0aa4fa4ba336b
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
  };

  initForm(data: any) {
    this.currentID.set(data._id);
    console.log('[initForm] data', data);

    if (data) {
      if (data.parentID){
        this.oldParentID = data.parentID;
        this.materialService.searchById(data.parentID).subscribe(res => {
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
        supplier: data.supplier
      });

      this.setStatus(data.status);
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
}
