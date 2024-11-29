import {Component, Input, signal, ViewChild, WritableSignal} from '@angular/core';
import {StatusSvgComponent} from "../../../../components/status-svg/status-svg.component";
import {DatePipe, NgClass, NgIf} from "@angular/common";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {complianceStatus} from "../../../../config/status-config";
import {DropdownComponent} from "../../../../components/dropdown/dropdown.component";
import {RadioComponent} from "../../../../components/radio/radio.component";
import {DocumentService, IDocument} from "../../../../services/document.service";
import {map} from "rxjs";
import {
  ComplianceMultiSelectComponent
} from "../../../../components/compliance-multi-select/compliance-multi-select.component";

type State = 'docList' | 'addNewDoc' | 'addNewCompliance' | 'changeCompliance';

@Component({
  selector: 'app-compliance',
  standalone: true,
  imports: [
    StatusSvgComponent,
    NgIf,
    ReactiveFormsModule,
    DropdownComponent,
    RadioComponent,
    NgClass,
    DatePipe,
    ComplianceMultiSelectComponent
  ],
  templateUrl: './compliance.component.html',
  styleUrl: './compliance.component.scss'
})
export class ComplianceComponent{
  @ViewChild(ComplianceMultiSelectComponent) complianceMultiSelectComponent!: ComplianceMultiSelectComponent;
  private _data: any = null;
  complianceData = [];

  @Input()
  set data(value: any) {
    this._data = value;
    // this.selectFirstCompliance();

    if (!this._data || !this._data.regulatoryCompliance) {
      return;
    }

    this.complianceData = this._data.regulatoryCompliance.map((item: any) => {
      return {
        id: item._id,
        title: item.title,
        status: {
          name: item.status,
          id: Math.floor(Math.random() * 10000)
        },
      }
    });
  }

  get data(): any {
    return this._data;
  }

  uploadedFile: File | null = null;
  currentState: WritableSignal<State> = signal('docList');
  // documents: WritableSignal<IDocument[]>  = signal([
  //   {
  //     _id: '777777771',
  //     title: 'no document',
  //     comments: '',
  //     fileUrl: '',
  //     updatedAt: '2024-10-16T18:01:39.839Z',
  //     uploadedBy: {
  //         name: ''
  //     }
  //   }
  // ]);
  documents: WritableSignal<IDocument[]>  = signal([]);

  fileName = '';
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

  complianceForm = this.fb.group({
    status: [''],
    applyStatusFor: ['current'], // current or allMaterials
    document_name: [''],
    name: [''],
    comments: [''],
    file: [null as File | null]
  });

  getForm() {
    return this.complianceForm.getRawValue();
  }

  constructor(private fb: FormBuilder,
              private documentService: DocumentService) {
  }

  changeCompliance(e: Event) {
    this.currentState.set('changeCompliance');
  }

  addNewCompliance() {
    this.currentState.set('addNewCompliance');
  }

  selectStatus(status: { name: string; id: string }){
    console.log('status', status);
    this.complianceForm.patchValue({status: status.name})
  }

  selectCompliance(item: any) {
    this.documentService.getDocuments(this.data._id,item._id)
      .pipe(
        map(result => result.data),
        map(data => data.documents),
        map(documents => documents)
      )
      .subscribe((data) => {
      this.documents.set(data);
    })
    this.currentState.set('docList');
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.uploadedFile = input.files[0];

      this.complianceForm.patchValue({ file });
    }
  }

  getComplianceMultiData(){
    return this.complianceMultiSelectComponent ? this.complianceMultiSelectComponent.getComplianceMultiData() : null;
  }

  clearFile(): void {
    this.uploadedFile = null;
  }

  selectFirstCompliance() {
    // todo
    // if (this._data.regulatoryCompliance && Array.isArray(this._data.regulatoryCompliance) && this._data.regulatoryCompliance.length) {
    //   this.selectCompliance(this._data.regulatoryCompliance[0]);
    // }
  }
}
