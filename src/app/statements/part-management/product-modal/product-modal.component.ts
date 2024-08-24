import {Component, Input, OnInit, signal} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ModalService} from "../../../components/modal/modal.service";
import {DropdownSearchComponent} from "../../../components/dropdown-search/dropdown-search.component";
import {DropdownComponent} from "../../../components/dropdown/dropdown.component";
import {MockDataService} from "../../../services/mock-data.service";

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, DropdownSearchComponent, DropdownComponent],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss'
})
export class ProductModalComponent implements OnInit {
  @Input() data?: any = null;

  showParentChoseInput: any = signal(null);
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
    description: [''],
    plant: [''],
  });
  productSearchList: any = [];
  allSuppliersData= this.mockDataService.allSuppliersData;
  statusDataList = this.mockDataService.statusDataList;
  availableSuppliers: any[] = [];

  // for parent list
  allProduct = [
    {
      parentID: null,
      id: 1,
      supplier: 'Rockstar Games',
      partNumber: '123SU152',
      plant: 'PLANT1',
      components: [
        {
          parentID: 1,
          id: 11,
          supplier: 'GTA San Diego',
          partNumber: '123SU15253',
          plant: 'PLANT21',
          components: [
            {
              parentID: 11,
              id: 111,
              supplier: 'GTA California',
              partNumber: '123SU1g5',
              components: [],
              description: 'gta California 2018',
              plant: 'PLAN33',
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
          description: 'rdr desc main 2',
          plant: 'PL12',
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
      description: 'decent description text',
      plant: 'plant123',
    },
    {
      parentID: 1,
      id: 11,
      supplier: 'GTA San Diego',
      partNumber: '123SU15253',
      components: [],
      description: 'gta V 2014 desc!',
      plant: 'plant413',
    },
    {
      parentID: 11,
      id: 111,
      supplier: 'GTA California',
      partNumber: '123SU1g5',
      components: [],
      description: 'gta California 2018',
      plant: 'plant5413',
    },
    {
      parentID: 1,
      id: 12,
      supplier: 'RDR Dakota',
      partNumber: '123SU15212',
      components: [],
      description: 'rdr desc main 2',
      plant: 'plant654',
    }
  ]; // from back-end by search input

  constructor(private fb: FormBuilder, private modal: ModalService, private mockDataService: MockDataService) {}

  close() {
    this.modal.closeModal();
  };

  uncheckRelatedParent() {
    if (this.isParentChosen) {
      this.isParentChosen = false
    };
  };

  submitModal() {
    this.modal.submitModal({
      oldData: this.data,
      newData: {
        currentSupplier: this.currentSupplier()
      }
    });
  };

  searchParent(searchedProduct: number | string = '') {
    if (searchedProduct) {

      this.productSearchList = this.allProduct.filter(product => {
        return product.partNumber.includes(searchedProduct.toString())  || (product.id == searchedProduct)
      }).filter(product => product.parentID);

      // call back-end data
      this.isParentListAvailable = true
    };
  };

  searchSupplier(search: string) {
    this.availableSuppliers = this.allSuppliersData.filter(supplier => supplier.name.includes(search) || supplier.name.toLowerCase().includes(search.toLowerCase()))
    this.isSupplierAvailable = true;
  };

  selectParentProduct(product: any) {
    this.isParentListAvailable = false;
    this.parentSearch = '';
    this.isParentChosen = product;
  };

  selectSupplier(supplier: { id: number, name: string }) {
    this.currentSupplier.set(supplier);
    this.isSupplierAvailable = false;
  };

  selectStatus(data: any) {
    console.log('selectStatus', data)
  }

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
    this.data = data;
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
        description: data.description,
        plant: data.plant
      });
    };
  };

  ngOnInit() {
    if (!this.data) {
      this.showParentChoseInput.set(true);
      return
    };

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
