import {Component, Input, OnInit, signal} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss'
})
export class ProductModalComponent implements OnInit{
  @Input() data?: any = null;

  showParentChoseInput = signal(null);
  currentID = signal(null);
  parentSearch = '';
  isParentListAvailable = false;
  isParentChosen:any = false;

  supplierSearch = '';
  isSupplierAvailable = false;
  currentSupplier: any = signal(null);

  productForm = this.fb.group({
    parentID: [''],
    partNumber: [''],
    description: ['1232']
  });

  // MONGO DB
  // JSON

  // 1 TABLE
    // id: 21132871,
    // id: 54132871,
    //  id: 5522871

  // 2 TABLE
  // id: 21132871 - [components] JSON
  productSearchList: any = [];

  allSuppliersData= [
    {id: 1, name: 'Activision'},
    {id: 2, name: 'Rockstar Games'},
    {id: 3, name: 'GTA San Diego'},
    {id: 4, name: 'RDR Dakota'},
    {id: 5, name: 'GTA California'},
  ];

  availableSuppliers: any[] = [];

  allProduct = [
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
  ]; // from back-end by search input


  constructor(private fb: FormBuilder) {}

  uncheckRelatedParent() {
    if (this.isParentChosen) {
      this.isParentChosen = false
    };
  };

  searchParent(searchedProduct: number | string = '') {
    if (searchedProduct) {

      this.productSearchList = this.allProduct.filter(product => {
        return product.partNumber.includes(searchedProduct.toString()) || (product.id == searchedProduct)
      }).filter(product => product.parentID);

      // call back-end data
      this.isParentListAvailable = true
    };
  };

  searchSupplier(search: string) {
    this.availableSuppliers = this.allSuppliersData.filter(supplier => supplier.name.includes(search))
    this.isSupplierAvailable = true;
  };

  selectParentProduct(product: any) {
    this.isParentListAvailable = false;
    this.parentSearch = '';
    this.isParentChosen = product;
    console.log('selectParentProduct product', product);
  };

  selectSupplier(supplier: { id: number, name: string }) {
    console.log('selectSupplier', supplier);
    this.currentSupplier.set(supplier);
    this.isSupplierAvailable = false;
  };

  focusSupplierInput() {
    this.availableSuppliers = [...this.allSuppliersData];
    this.isSupplierAvailable = true;
  };

  changeModalComponent(componentData: any, event: Event) {
    event.stopPropagation();
    this.rerenderAllData(componentData);
  };

  rerenderAllData(data: any) {
    this.isParentListAvailable = false;
    this.parentSearch = '';
    this.initForm(data);
  };

  clearCurrentSupplier() {
    this.currentSupplier.set(null);
  };

  initForm(data: any) {

    this.allSuppliersData.forEach(supplier => {
      if (supplier.name === data.supplier) {
        this.currentSupplier.set(supplier);
      };
    })

    this.currentID.set(data.id);

    this.showParentChoseInput.set(data.parentID);

    if (data) {
      this.productForm.setValue({
        parentID: data.parentID,
        partNumber: data.partNumber,
        description: data.description
      });
    };
  };

  ngOnInit() {

    // при получении this.data оно содержит 1 уровень вложености
    // нужно сделать запрос на бек что бы получить всю иерархию
    // this.data - fetch full data about components!!!


    // убрать со  списка доступных парентов текущий
    this.allProduct = this.allProduct.filter(product => this.data.id !== product.id);
    this.initForm(this.data);

    // build components hierarch

    console.log('data', this.data);
  }
}
