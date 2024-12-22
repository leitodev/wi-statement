import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {DropdownSearchComponent} from "../components/dropdown-search/dropdown-search.component";
import {DropdownComponent} from "../components/dropdown/dropdown.component";
import {RadioComponent} from "../components/radio/radio.component";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {complianceStatus} from "../config/status-config";
import {
  ComplianceMultiSelectComponent,
  IComplianceInputData
} from "../components/compliance-multi-select/compliance-multi-select.component";
import {DropdownMultiComponent} from "../components/dropdown-multi/dropdown-multi.component";


@Component({
  selector: 'app-ui-kit',
  standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
        NgOptimizedImage,
        DropdownSearchComponent,
        DropdownComponent,
        RadioComponent,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        ComplianceMultiSelectComponent,
        DropdownMultiComponent
    ],
  templateUrl: './ui-kit.component.html',
  styleUrl: './ui-kit.component.scss'
})
export class UiKitComponent {
  fileName = '';

  optionsForRadio = [
    {
      id:1,
      name: 'test1',
      value: 'test10001'
    },
    {
      id:2,
      name: 'test3',
      value: 'test30003'
    },
    {
      id:3,
      name: 'test47',
      value: 'test47'
    }
  ];



  form = this.fb.group({
    radio: ['test30003'],
  });

  public tabActive = 'General';

  public dropdownDataList = [
    {id: 1, name: "Rejected"},
    {id: 2, name: "Approved"},
    {id: 3, name: "Pending"}
  ];

  public productSearchList = [
    {
      parentID: null,
      id: 1,
      supplier: 'Rockstar Games',
      partNumber: '123SU152',
      components: [
        {
          parentID: 1,
          id: 11,
          supplier: 'GTA San Diego',
          partNumber: '123SU15253',
          components: [
            {
              parentID: 11,
              id: 111,
              supplier: 'GTA California',
              partNumber: '123SU1g5',
              components: [],
              description: 'gta California 2018'
            },
          ],
          description: 'gta V 2014 desc!'
        },
        {
          parentID: 1,
          id: 12,
          supplier: 'RDR Dakota',
          partNumber: '123SU15212',
          components: [],
          description: 'rdr desc main 2'
        },
      ],
      description: 'lorem text'
    },
    {
      parentID: null,
      id: 2,
      supplier: 'Activision',
      partNumber: 'W1889000001',
      components: [],
      description: 'decent description text'
    },
    {
      parentID: 1,
      id: 11,
      supplier: 'GTA San Diego',
      partNumber: '123SU15253',
      components: [],
      description: 'gta V 2014 desc!'
    },
    {
      parentID: 11,
      id: 111,
      supplier: 'GTA California',
      partNumber: '123SU1g5',
      components: [],
      description: 'gta California 2018'
    },
    {
      parentID: 1,
      id: 12,
      supplier: 'RDR Dakota',
      partNumber: '123SU15212',
      components: [],
      description: 'rdr desc main 2'
    }
  ];

  constructor(private fb: FormBuilder) {
  }

  // DROPDOWN with SEARCH
  public selectedItemUIkit(value: any) {
  }
  public searchedItemUIkit(value: any) {
  }
  //-


  onFileSelected(file: any) {
  }

  complianceData: IComplianceInputData[] = [
    {
      id: 123,
      title: "EU REACH",
      status: {
        name: 'does_not_comply',
        id: 2324
      }
    },
    {
      id: 32,
      title: "EU RoHS",
      status: {
        name: 'comply',
        id: 23244
      }
    },
    {
      id: 87,
      title: "PFAS",
      status: {
        name: 'na',
        id: 23244
      }
    },
  ];

  protected readonly statuses = complianceStatus;
}
