import {Component, Input, OnInit, signal, ViewChild} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ModalService} from "../../../components/modal/modal.service";
import {SupplierService} from "../../../services/supplier.service";
import {ToastrService} from "ngx-toastr";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {ModalTypes} from "../../../components/modal/modal-types";
import {DropdownComponent} from "../../../components/dropdown/dropdown.component";
import {DropdownSearchComponent} from "../../../components/dropdown-search/dropdown-search.component";
import {supplierStatus} from "../../../config/status-config";
import {ContactsComponent} from "./contacts/contacts.component";

@Component({
  selector: 'app-supplier-modal',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    DropdownComponent,
    DropdownSearchComponent,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    ContactsComponent
  ],
  templateUrl: './supplier-modal.component.html',
  styleUrl: './supplier-modal.component.scss'
})
export class SupplierModalComponent implements OnInit{
  @ViewChild(ContactsComponent) contactsComponent!: ContactsComponent;
  @Input() data?: any = null;
  public tabActive = 'General';
  currentID = signal(null);
  statusDataList = supplierStatus;

  productForm = this.fb.group({
    name: [''],
    email: [''],
    countryOfOrigin: [''],
    notes: [''],
    status: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private modal: ModalService,
    private supplierService: SupplierService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    if (!this.data) {
      return
    };
    this.initForm(this.data);
  }

  initForm(data: any) {
    this.currentID.set(data._id);

    this.productForm.setValue({
      name: data.name,
      email: data.email,
      countryOfOrigin: data.countryOfOrigin,
      notes: data.notes,
      status: data.status,
    });
  }

  setStatus(status: any) {
    return this.statusDataList.find(data => data.name === status);
  }

  close() {
    this.modal.closeModal();
  };

  submitModal() {
    const contactData = this.contactsComponent.contactForm.value;
    let modalEvent = ModalTypes.NEW;

    if(this.currentID()) {
      modalEvent = ModalTypes.UPDATE;
    };

    // Tab General Data
    this.modal.submitModal(
      {
        id: this.currentID(),
        form: {
          contactPersons: contactData.contactPersons,
          ...this.productForm.getRawValue(),}
      }, modalEvent);
  };

}
