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
import {MaterialList, MaterialService} from "../../services/material.service";
import {ModalTypes} from "../../components/modal/modal-types";
import {materialStatus} from "../../config/status-config";

@Component({
  selector: 'app-part-management',
  standalone: true,
  imports: [WiTableComponent, ProductModalComponent, DropdownSearchComponent, DropdownComponent, AsyncPipe, CommonModule],
  templateUrl: './part-management.component.html',
  styleUrl: './part-management.component.scss',
  providers: []
})
export class PartManagementComponent implements OnInit {
  tableData$$ = new BehaviorSubject<MaterialList[]>([]);
  statusDataList = materialStatus;
  tableConfig = tableConfig;
  isFilterVisible = false;

  // for filter
  availableSuppliers: any[] = [];
  allSuppliersData = [...this.mockDataService.getSuppliers()]

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
      this.tableData$$.next(data);
    })
  }

  tableEvent(event: any) {
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

  searchSupplier(search: string) {
    this.availableSuppliers = this.allSuppliersData
      .filter(supplier =>
        supplier.name.includes(search) || supplier.name.toLowerCase().includes(search.toLowerCase())
      )
  };

  selectSupplier(supplier: { id: number, name: string }) {
    // TODO filter
  };

  selectStatus(status: any) {
    console.log('status selected', status);
  }

}// Part Management
