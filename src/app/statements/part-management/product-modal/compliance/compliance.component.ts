import {Component, Input, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
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
import {MaterialService, RegulationList} from "../../../../services/material.service";

type State = 'docList' | 'addNewDoc' | 'addNewCompliance' | 'changeCompliance';

interface IComplianceData {
  id: string;
  title: string;
  status: {
    id: number;
    name: string;
  };
  selected?: boolean;
}

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
export class ComplianceComponent implements OnInit {
  @ViewChild(ComplianceMultiSelectComponent) complianceMultiSelectComponent!: ComplianceMultiSelectComponent;
  private _data: any = null;
  complianceData: IComplianceData[] = [];
  complianceFromCurrentMaterial: IComplianceData[] = [];

  @Input()
  set data(value: any) {
    this._data = value;
    // this.selectFirstCompliance();

    if (!this._data || !this._data.regulatoryCompliance) {
      return;
    }

    this.complianceFromCurrentMaterial = this._data.regulatoryCompliance.map((item: any) => {
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

  ngOnInit() {
    this.materialService.getAllComplianceList().subscribe(res => {
      this.complianceData = res.data.regulations.map(data => {
        return {
          id: data._id,
          title: data.title,
          status: {
            id: Math.floor(Math.random() * 10000),
            name: data.status
          },
        }
      });

      for (let i = 0; i < this.complianceData.length; i++) {
        this.complianceData[i].status.name = '';

        for (let j = 0; j < this.complianceFromCurrentMaterial.length; j++) {
          if (this.complianceFromCurrentMaterial[j].id === this.complianceData[i].id) {
            this.complianceData[i].status.name = this.complianceFromCurrentMaterial[j].status.name;
            this.complianceData[i].selected = true;
            break;
          }
        }

      } // for

    });
  }

  get data(): any {
    return this._data;
  }

  uploadedFile: File | null = null;
  currentState: WritableSignal<State> = signal('docList');
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
              private documentService: DocumentService,
              private materialService: MaterialService) {
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
