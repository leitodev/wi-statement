import {Component, OnInit, signal, TemplateRef, ViewChild} from '@angular/core';
import {IFieldSortData, WiTableComponent} from "../../components/wi-table/wi-table.component";
import tableConfig from "./table-config";
import {ModalService} from "../../components/modal/modal.service";
import {ProductModalComponent} from "./product-modal/product-modal.component";
import {DropdownSearchComponent} from "../../components/dropdown-search/dropdown-search.component";
import {MockDataService} from "../../services/mock-data.service";
import {DropdownComponent} from "../../components/dropdown/dropdown.component";
import {AsyncPipe, CommonModule} from "@angular/common";
import { map, tap} from "rxjs";
import {MaterialList, MaterialService} from "../../services/material.service";
import {ModalTypes} from "../../components/modal/modal-types";
import {MaterialsFilterComponent} from "./materials-filter/materials-filter.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-part-management',
  standalone: true,
  imports: [WiTableComponent, ProductModalComponent, DropdownSearchComponent, DropdownComponent, AsyncPipe, CommonModule, MaterialsFilterComponent],
  templateUrl: './part-management.component.html',
  styleUrl: './part-management.component.scss',
  providers: []
})
export class PartManagementComponent implements OnInit {
  tableData = signal<MaterialList[]>([]);
  totalPages = signal(1);
  tableConfig = tableConfig;
  isFilterVisible = false;

  private defaultTableQueryParams = {
    page: tableConfig.paginator.currentPage,
    limit: tableConfig.limit
  }
  private tableQueryParams: { [key: string]: any }  = {
    ...this.defaultTableQueryParams
  };

  @ViewChild('modalTemplate', { static: true }) modalTemplate!: TemplateRef<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private materialService: MaterialService,
    private mockDataService: MockDataService) {
  };

  ngOnInit() {
    this.applyFilterFromURL();
  };

  applyFilterFromURL() {
    // TODO need improve it
    const supplier = this.activatedRoute.snapshot.queryParams['supplier'];

    if (supplier) {
      this.isFilterVisible = true;
    } else {
      this.refreshData(this.tableQueryParams);
    }
  }

  refreshData(tableQueryParams: any = null) {
    this.materialService.get(tableQueryParams).pipe(
      tap(material => {
        this.tableConfig.paginator.totalPages = material.data.totalPages;
        this.totalPages.set(material.data.totalPages);
      }),
      map(result => result.data),
      map(data => data.materials)
    ).subscribe(data => {
      this.tableData.set(data);
    })
  }

  tableEvent(event: any) {
    // TODO to enum types
    if (event.eventName == 'changePage') {
      this.tableQueryParams['page'] = event.data;
      this.refreshData(this.tableQueryParams);
    }

    if (event.eventName === 'applySort' && event.data?.sortBy) {
      this.applySort(event.data);
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

  openModal(modalTemplate: TemplateRef<any>, data: any) {
    this.modalService
        .open(modalTemplate, {
            size: 'lg',
            data: data
        })
        .subscribe((action) => {

          // Custom tabs events
          if (action.data && action.data.tabActive) {
            if (action.data.state === 'addNewCompliance') {
              this.addNewCompliance(action.data);
            }

            if (action.data.state === 'changeCompliance') {
              this.changeCompliance(action.data);
            }
            return;
          }

          // General Modal Events
          console.log(action.event);
          if (action.event === ModalTypes.NEW) {
            this.addNewMaterial(action.data);
          } else if (action.event === ModalTypes.UPDATE) {
            this.updateMaterial(action.data.id, action.data);
          }
        });
  };

  changeCompliance(data: any) {
    this.materialService.changeCompliance(data)
      .subscribe((result: any) => {
        if (result) {
          this.refreshData();
          this.modalService.closeModal();
        }
      });
  }

  addNewCompliance(data: any) {
    this.materialService.addNewCompliance(data)
      .subscribe((result: any) => {
        if (result) {
          this.refreshData();
          this.modalService.closeModal();
        }
      });
  }

  addNewMaterial(data: any) {
    this.materialService.addMaterial(data)
      .subscribe((result: any) => {
        if (result) {
          this.tableData.set([result.data.material, ...this.tableData()]);
          this.modalService.closeModal();
        }
      });
  }

  updateMaterial(id: any, data: any){
    this.materialService.update(id, data)
      .subscribe((result: any) => {
        if (result) {
          this.refreshData(this.tableQueryParams);
          this.modalService.closeModal();
        }
      });
  }

  applySort(data: IFieldSortData) {
    this.tableQueryParams['sortBy'] = data.sortBy;
    this.tableQueryParams['sortOrder'] = data.sortOrder;
    this.refreshData(this.tableQueryParams);
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

}// Part Management
