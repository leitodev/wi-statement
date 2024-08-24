import {Component, OnInit, signal, TemplateRef, ViewChild} from '@angular/core';
import {WiTableComponent} from "../../components/wi-table/wi-table.component";
import tableConfig from "./table-config";
import {ModalService} from "../../components/modal/modal.service";
import {ProductModalComponent} from "./product-modal/product-modal.component";
import {PartManagementService} from "./part-management.service";
import {DropdownSearchComponent} from "../../components/dropdown-search/dropdown-search.component";
import {MockDataService} from "../../services/mock-data.service";
import {DropdownComponent} from "../../components/dropdown/dropdown.component";

@Component({
  selector: 'app-part-management',
  standalone: true,
  imports: [WiTableComponent, ProductModalComponent, DropdownSearchComponent, DropdownComponent],
  templateUrl: './part-management.component.html',
  styleUrl: './part-management.component.scss',
  providers: [PartManagementService]
})
export class PartManagementComponent implements OnInit {

  // DATA from Back-End (without components nesting)
  public data =  this.partManagementService.getData();

  statusDataList = this.mockDataService.statusDataList;

  public tableConfig = tableConfig;
  public isFilterVisible = true;

  // for filter
  isSupplierAvailable = false
  currentSupplier: any = signal(null);
  public availableSuppliers: any[] = [];
  public allSuppliersData = [...this.mockDataService.getSuppliers()]

  @ViewChild('modalTemplate', { static: true }) modalTemplate!: TemplateRef<any>;

  constructor(private modalService: ModalService,
              private partManagementService: PartManagementService,
              private mockDataService: MockDataService) {
  };

  ngOnInit() {};

  tableEvent(event: any) {
    this.openModal(this.modalTemplate, event.data);
  };

  addNew() {
    this.openModal(this.modalTemplate, null);
  };

  toggleFilter() {
    this.isFilterVisible = !this.isFilterVisible;
  };

  applyFilter() {}

  openModal(modalTemplate: TemplateRef<any>, data: any) {
    this.modalService
        .open(modalTemplate, {
            size: 'lg',
            data: data
        })
        .subscribe((action: any) => {
          console.log('modalTemplate', modalTemplate);
          console.log('modalAction', action);
        });
  };

  // filters
  searchSupplier(search: string) {
    this.availableSuppliers = this.allSuppliersData.filter(supplier => supplier.name.includes(search) || supplier.name.toLowerCase().includes(search.toLowerCase()))
    this.isSupplierAvailable = true;
  };

  selectSupplier(supplier: { id: number, name: string }) {
    this.currentSupplier.set(supplier);
    this.isSupplierAvailable = false;
  };

  clearCurrentSupplier() {
    this.currentSupplier.set(null);
  };

  selectStatus(status: any) {
    console.log('status selected', status);
  }

}// Part Management
