import {Component, OnInit, signal, TemplateRef, ViewChild} from '@angular/core';
import {WiTableComponent} from "../../components/wi-table/wi-table.component";
import tableConfig from "./table-config";
import {ModalService} from "../../components/modal/modal.service";
import {ProductModalComponent} from "./product-modal/product-modal.component";
import {DropdownSearchComponent} from "../../components/dropdown-search/dropdown-search.component";
import {MockDataService} from "../../services/mock-data.service";
import {DropdownComponent} from "../../components/dropdown/dropdown.component";
import {AsyncPipe, CommonModule} from "@angular/common";
import {catchError, map, Observable, of, tap} from "rxjs";
import {MaterialService} from "../../services/material.service";

@Component({
  selector: 'app-part-management',
  standalone: true,
  imports: [WiTableComponent, ProductModalComponent, DropdownSearchComponent, DropdownComponent, AsyncPipe, CommonModule],
  templateUrl: './part-management.component.html',
  styleUrl: './part-management.component.scss',
  providers: []
})
export class PartManagementComponent implements OnInit {
  statusDataList = this.mockDataService.statusDataList;

  public tableConfig = tableConfig;
  public isFilterVisible = false;

  // for filter
  isSupplierAvailable = false
  currentSupplier: any = signal(null);
  public availableSuppliers: any[] = [];
  public allSuppliersData = [...this.mockDataService.getSuppliers()]

  public data$ =  this.materialService.get().pipe(
    tap(data => {
      this.tableConfig.paginator.totalPages = data.data.totalPages;
      console.log('[materialService] data', data);
    }),
    map(result => result.data),
    map(data => data.materials)
  );

  @ViewChild('modalTemplate', { static: true }) modalTemplate!: TemplateRef<any>;

  constructor(
              private modalService: ModalService,
              private materialService: MaterialService,
              private mockDataService: MockDataService) {
  };

  ngOnInit() {};

  refreshData(page: number) {
    this.data$ =  this.materialService.get(page).pipe(
      map(result => result.data),
      map(data => data.materials),
    );
  }

  tableEvent(event: any) {
    console.log('[tableEvent] event', event);
    // TODO to enum types
    if (event.eventName == 'changePage') {
      this.refreshData(event.data);
    }

    if (['tableRowCLick', 'tableRowEditBtn'].includes(event.eventName)) {
      this.openModal(this.modalTemplate, event.data);
    }
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
          this.addNewMaterial(action.data);
        });
  };

  addNewMaterial(data: any) {
    this.materialService.addMaterial(data.form)
      .subscribe((result: any) => {
        console.log('post result', result);
      });
  }

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
