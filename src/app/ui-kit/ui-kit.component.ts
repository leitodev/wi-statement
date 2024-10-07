import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";
import {DropdownSearchComponent} from "../components/dropdown-search/dropdown-search.component";
import {DropdownComponent} from "../components/dropdown/dropdown.component";
import {RadioComponent} from "../components/radio/radio.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";


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
    ReactiveFormsModule
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
    console.log('[UiKit] Selected Item:', value);
  }
  public searchedItemUIkit(value: any) {
    console.log('[UiKit] Searched Item:', value);
  }
  //-


  onFileSelected(file: any) {
    console.log('file for upload', file);
  }


}
