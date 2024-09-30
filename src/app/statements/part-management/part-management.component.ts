import {Component, OnInit, signal, TemplateRef, ViewChild} from '@angular/core';
import {WiTableComponent} from "../../components/wi-table/wi-table.component";
import tableConfig from "./table-config";
import {ModalService} from "../../components/modal/modal.service";
import {ProductModalComponent} from "./product-modal/product-modal.component";
import {DropdownSearchComponent} from "../../components/dropdown-search/dropdown-search.component";
import {MockDataService} from "../../services/mock-data.service";
import {DropdownComponent} from "../../components/dropdown/dropdown.component";
import {AsyncPipe, CommonModule} from "@angular/common";
import {BehaviorSubject, map, tap} from "rxjs";
import {MaterialService} from "../../services/material.service";
import {ModalEventType} from "../../components/modal/modal-event-type";

@Component({
  selector: 'app-part-management',
  standalone: true,
  imports: [WiTableComponent, ProductModalComponent, DropdownSearchComponent, DropdownComponent, AsyncPipe, CommonModule],
  templateUrl: './part-management.component.html',
  styleUrl: './part-management.component.scss',
  providers: []
})
export class PartManagementComponent implements OnInit {

  tableData$$ = new BehaviorSubject<any[]>([]);

  statusDataList = this.mockDataService.statusDataList;

  public tableConfig = tableConfig;
  public isFilterVisible = false;

  // for filter
  isSupplierAvailable = false
  currentSupplier: any = signal(null);
  public availableSuppliers: any[] = [];
  public allSuppliersData = [...this.mockDataService.getSuppliers()]

  // public data$ =  this.materialService.get().pipe(
  //   tap(material => {
  //     this.tableConfig.paginator.totalPages = material.data.totalPages;
  //   }),
  //   map(result => result.data),
  //   map(data => data.materials)
  // );

  @ViewChild('modalTemplate', { static: true }) modalTemplate!: TemplateRef<any>;

  constructor(
              private modalService: ModalService,
              private materialService: MaterialService,
              private mockDataService: MockDataService) {
  };

  ngOnInit() {
    this.refreshData();
  };

  refreshData(page: number = 1) {
    this.materialService.get(page).pipe(
      tap(material => {
        this.tableConfig.paginator.totalPages = material.data.totalPages;
      }),
      map(result => result.data),
      map(data => data.materials)
    ).subscribe(data => {
      console.log('[subscribe] data', data);
      this.tableData$$.next(data);
    })
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
          if (action.event === ModalEventType.NEW) {
            this.addNewMaterial(action.data);
          } else if (action.event === ModalEventType.UPDATE) {
            this.updateMaterial(action.data.id, action.data);
          }

        });
  };

  addNewMaterial(data: any) {
    this.materialService.addMaterial(data)
      .subscribe((result: any) => {
        if (result) {
          //todo change logic (push new material to tableData$$)
          this.tableData$$.next([result.data.material, ...this.tableData$$.value]);
          this.modalService.closeModal();
        }
      });
  }

  updateMaterial(id: any, data: any){
    this.materialService.update(id, data)
      .subscribe((result: any) => {
        if (result) {
          this.refreshData();
          this.modalService.closeModal();
        }
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
