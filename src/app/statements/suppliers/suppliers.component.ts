import {Component, OnInit, signal, TemplateRef, ViewChild} from '@angular/core';
import {MaterialsFilterComponent} from "../part-management/materials-filter/materials-filter.component";
import {ProductModalComponent} from "../part-management/product-modal/product-modal.component";
import {IFieldSortData, WiTableComponent} from "../../components/wi-table/wi-table.component";
import tableConfig from "./table-config";
import {Supplier, SupplierService} from "../../services/supplier.service";
import {map, tap} from "rxjs";
import {ModalService} from "../../components/modal/modal.service";
import {SupplierModalComponent} from "./supplier-modal/supplier-modal.component";
import {ModalTypes} from "../../components/modal/modal-types";
import {Router} from "@angular/router";
import {SupplierFilterComponent} from "./supplier-filter/supplier-filter.component";

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    MaterialsFilterComponent,
    ProductModalComponent,
    WiTableComponent,
    SupplierModalComponent,
    SupplierFilterComponent
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
    private router: Router,
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
    })
  }

  toggleFilter() {
    this.isFilterVisible = !this.isFilterVisible;
  };

  applySort(data: IFieldSortData) {
    this.tableQueryParams['sortBy'] = data.sortBy;
    this.tableQueryParams['sortOrder'] = data.sortOrder;
    this.refreshData(this.tableQueryParams);
  }

  tableEvent(event: any) {
    // TODO Enums
    if (event.eventName == 'changePage') {
      this.tableQueryParams['page'] = event.data;
      this.refreshData(this.tableQueryParams);
    }

    if (event.eventName === 'applySort' && event.data?.sortBy) {
      this.applySort(event.data);
    }

    if (event.eventName === 'tableRowEditBtn') {
      this.openModal(this.modalTemplate, event.data);
    }

    if (event.eventName === 'tableFieldClick' && event.cellData.type === 'redirectTo') {
      this.router.navigate(['/statements/list'], {
        queryParams: {
          supplier: event.cellValue
        }
      });
    }
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
        if (action.event === ModalTypes.NEW) {
          this.addNewSupplier(action.data);
        } else if (action.event === ModalTypes.UPDATE) {
          this.updateSupplier(action.data.id, action.data);
        }
      });
  };

  addNewSupplier(newSupplier: Supplier) {
    this.supplierService.add(newSupplier)
      .subscribe((result) => {
        if (result) {
          this.tableData.set([result.data.supplier, ...this.tableData()]);
          this.modalService.closeModal();
        }
      });
  }

  updateSupplier(id: string, data: any){
    this.supplierService.update(id, data)
      .subscribe((result) => {
        if (result) {
          this.refreshData(this.tableQueryParams);
          this.modalService.closeModal();
        }
      });
  }

  applyFilter(data: { [key: string]: string }){
    this.tableQueryParams  = {
      ...this.defaultTableQueryParams
    };

    if (data === null) {
      this.refreshData(this.tableQueryParams);
      return;
    };

    this.tableQueryParams['page'] = 1; // filter works only with this param !???!?
    for (const property in data) {
      if (data[property] && data[property].length > 0) {
        this.tableQueryParams[property] = data[property];
      }
    };

    this.refreshData(this.tableQueryParams);
  }

}
