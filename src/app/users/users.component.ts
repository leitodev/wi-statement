import {Component, computed, signal, TemplateRef, ViewChild} from '@angular/core';
import {MaterialsFilterComponent} from "../statements/part-management/materials-filter/materials-filter.component";
import {ProductModalComponent} from "../statements/part-management/product-modal/product-modal.component";
import {IFieldSortData, WiTableComponent} from "../components/wi-table/wi-table.component";
import tableConfig from "./table-config";
import {MaterialList, MaterialService} from "../services/material.service";
import {User, UsersResponse, UsersService} from "../services/users.service";
import {ModalTypes} from "../components/modal/modal-types";
import {ModalService} from "../components/modal/modal.service";
import {MockDataService} from "../services/mock-data.service";
import {UsersModalComponent} from "./users-modal/users-modal.component";
import {map, of, tap} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {UsersFilterComponent} from "./users-filter/users-filter.component";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    WiTableComponent,
    UsersModalComponent,
    UsersFilterComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  private defaultTableQueryParams = {
    page: tableConfig.paginator.currentPage,
    limit: tableConfig.limit
  }
  private tableQueryParams: { [key: string]: any }  = {
    ...this.defaultTableQueryParams
  };

  tableConfig = tableConfig;
  tableData = signal<User[]>([]);
  totalPages = signal(1);
  isFilterVisible = false;

  @ViewChild('modalTemplate', { static: true }) modalTemplate!: TemplateRef<any>;
  deleteMe(){
    console.log(this.tableData())
  }
  addNew() {
    this.openModal(this.modalTemplate, null);
  };
  toggleFilter() {
    this.isFilterVisible = !this.isFilterVisible;
  };
  applyFilter(data: { [key: string]: string }){
    if (data === null) {
      this.tableQueryParams  = {
        ...this.defaultTableQueryParams
      };
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
  applySort(data: IFieldSortData) {
    this.tableQueryParams['sortBy'] = data.sortBy;
    this.tableQueryParams['sortOrder'] = data.sortOrder;
    this.refreshData(this.tableQueryParams);
  }
  openModal(modalTemplate: TemplateRef<any>, data: any) {
    this.modalService
        .open(modalTemplate, {
          size: 'lg',
          data: data
        })
        .subscribe((action) => {
          // General Modal Events
          console.log(action.event);
          if (action.event === ModalTypes.NEW) {
            this.addNewUser(action.data);
          } else if (action.event === ModalTypes.UPDATE) {
            this.updateUser(action.data, action.data.id);
          }
        });
  };
  tableEvent(event: any) {
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
  ngOnInit() {
    this.refreshData();
  }
  refreshData(tableQueryParams: any = null) {
    this.usersService.getAll(tableQueryParams).pipe(
        tap(users => {
          this.tableConfig.paginator.totalPages = users.data.totalPages;
          this.totalPages.set(users.data.totalPages);
        }),
        map(({data}) => data.users)
    ).subscribe(data => {
      this.tableData.set(data);
    })
  }
  constructor(private usersService: UsersService,
              private modalService: ModalService) {
  }
  addNewUser(data: any) {
    this.usersService.create(data).subscribe(
        (result: any) =>
        {
          if (result) {
            this.refreshData();
            this.modalService.closeModal();
          }
        }
    );
  }
  updateUser(newData: any, id: string){
    this.usersService.update(newData, id).pipe(
        tap(()=>this.refreshData(this.tableQueryParams))
    ).subscribe(
        (result: any) =>
        {
          if (result) {
            this.refreshData();
            this.modalService.closeModal();
          }
        }
    );
  }
}