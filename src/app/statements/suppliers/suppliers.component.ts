import {Component, OnInit, signal, TemplateRef, ViewChild} from '@angular/core';
import {MaterialsFilterComponent} from "../part-management/materials-filter/materials-filter.component";
import {ProductModalComponent} from "../part-management/product-modal/product-modal.component";
import {IFieldSortData, WiTableComponent} from "../../components/wi-table/wi-table.component";
import tableConfig from "./table-config";
import {Supplier, SupplierService} from "../../services/supplier.service";
import {map, tap} from "rxjs";
import {ModalService} from "../../components/modal/modal.service";
import {SupplierModalComponent} from "./supplier-modal/supplier-modal.component";

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    MaterialsFilterComponent,
    ProductModalComponent,
    WiTableComponent,
    SupplierModalComponent
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss'
})
export class SuppliersComponent implements OnInit{
  @ViewChild('modalTemplate', { static: true }) modalTemplate!: TemplateRef<any>;

  tableData = signal<Supplier[]>([]);
  totalPages = signal(1);
  isFilterVisible = false;
  tableConfig = tableConfig;

  private defaultTableQueryParams = {
    page: tableConfig.paginator.currentPage,
    limit: tableConfig.limit
  }
  private tableQueryParams: { [key: string]: any }  = {
    ...this.defaultTableQueryParams
  };

  constructor(
    private modalService: ModalService,
    private supplierService: SupplierService) {
  };

  ngOnInit() {
    this.refreshData(this.tableQueryParams);
  };

  refreshData(tableQueryParams: any = null) {
    this.supplierService.get(tableQueryParams).pipe(
      tap(material => {
        this.tableConfig.paginator.totalPages = material.data.totalPages;
        this.totalPages.set(material.data.totalPages);
      }),
      map(({data}) => data.suppliers)
    ).subscribe(data => {
      this.tableData.set(data);
      console.log('[refreshData] data', data);
    })
  }

  toggleFilter() {
    // this.isFilterVisible = !this.isFilterVisible;
  };

  applySort(data: IFieldSortData) {
    this.tableQueryParams['sortBy'] = data.sortBy;
    this.tableQueryParams['sortOrder'] = data.sortOrder;
    this.refreshData(this.tableQueryParams);
  }

  tableEvent(event: any) {
    // TODO Enums
    // if (event.eventName == 'changePage') {
    //   this.tableQueryParams['page'] = event.data;
    //   this.refreshData(this.tableQueryParams);
    // }
    //
    if (event.eventName === 'applySort' && event.data?.sortBy) {
      this.applySort(event.data);
    }
    //
    // if (['tableRowCLick', 'tableRowEditBtn'].includes(event.eventName)) {
    //   this.openModal(this.modalTemplate, event.data);
    // }
  };

  addNew() {
    this.openModal(this.modalTemplate, null);
  };

  openModal(modalTemplate: TemplateRef<any>, data: any) {
    this.modalService
      .open(modalTemplate, {
        size: 'lg',
        data: data
      })
      .subscribe((action) => {
        // General Modal Events
        // if (action.event === ModalTypes.NEW) {
        //   this.addNewMaterial(action.data);
        // } else if (action.event === ModalTypes.UPDATE) {
        //   this.updateMaterial(action.data.id, action.data);
        // }
      });
  };
}
