import {Component, Input, signal} from '@angular/core';
import {StatusSvgComponent} from "../../../../components/status-svg/status-svg.component";
import {NgIf} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {complianceStatus, materialStatus} from "../../../../config/status-config";
import {DropdownComponent} from "../../../../components/dropdown/dropdown.component";
import {RadioComponent} from "../../../../components/radio/radio.component";

@Component({
  selector: 'app-compliance',
  standalone: true,
  imports: [
    StatusSvgComponent,
    NgIf,
    ReactiveFormsModule,
    DropdownComponent,
    RadioComponent
  ],
  templateUrl: './compliance.component.html',
  styleUrl: './compliance.component.scss'
})
export class ComplianceComponent {
  @Input() data?: any = null
  fileName = '';
  complianceData: any= signal(null);
  statuses = complianceStatus;
  applyStatusFor = [
    {
      id: 1,
      name: 'Apply only for the current material',
      value: 'current'
    },
    {
      id: 2,
      name: 'All materials from this supplier',
      value: 'forThisSupplier'
    },
  ];

  confirmationDocument = [
    {
      id: 11,
      name: 'Confirmation of conformity',
      value: true
    },
    {
      id: 22,
      name: 'Non-conformity',
      value: false
    },
  ];

  complianceForm = this.fb.group({
    status: [''],
    applyStatusFor: ['current'],
    documentConfirmation: [false],
    name: [''],
    description: [''],
  });

  addNewCompliance() {
    console.log('addNewCompliance')
  }

  selectStatus(status: any){
    console.log('status', status);
  }

  selectCompliance(item: any) {
    console.log('selectCompliance', item);
    console.log('load compliance data.....') // todo
    this.complianceData.set({name: 'wwww'});
  }

  onFileSelected(file: any) {
    console.log('file for upload', file);
  }

  protected readonly statusDataList = materialStatus;

  constructor(private fb: FormBuilder) {
  }

}
