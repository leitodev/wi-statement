import {Component, Input, OnInit, signal} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ModalService} from "../../../components/modal/modal.service";
import {SupplierService} from "../../../services/supplier.service";
import {ToastrService} from "ngx-toastr";
import {NgTemplateOutlet} from "@angular/common";
import {ModalTypes} from "../../../components/modal/modal-types";

@Component({
  selector: 'app-supplier-modal',
  standalone: true,
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './supplier-modal.component.html',
  styleUrl: './supplier-modal.component.scss'
})
export class SupplierModalComponent implements OnInit{
  @Input() data?: any = null;
  public tabActive = 'General';
  currentID = signal(null);

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
    console.log('data.parentID', data.parentID);
    // update form data
  }


  close() {
    this.modal.closeModal();
  };

  submitModal() {
    let modalEvent = ModalTypes.NEW;

    if(this.currentID()) {
      modalEvent = ModalTypes.UPDATE;
    };

    // if(this.tabActive == 'Compliance') {
    //   this.modal.submitModal({
    //     complianceList: this.childFormComponent.getComplianceMultiData(),
    //     tabActive: this.tabActive,
    //     state: this.childFormComponent.currentState(),
    //     form: this.childFormComponent.getForm(),
    //     modalData: this.data,
    //   }, modalEvent);
    //   return;
    // }
    // // Tab General Data
    // this.modal.submitModal({
    //   isParentChosen: this.isParentChosen,
    //   oldParentID: this.oldParentID,
    //   id: this.data?._id ? this.data._id : null,
    //   form: this.productForm.getRawValue()
    // }, modalEvent);
  };
}
