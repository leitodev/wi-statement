import {Component, signal, TemplateRef, ViewChild} from '@angular/core';
import tableConfig from "./table-config";
import {UsersFilterComponent} from "../users/users-filter/users-filter.component";
import {UsersModalComponent} from "../users/users-modal/users-modal.component";
import {IFieldSortData, WiTableComponent} from "../components/wi-table/wi-table.component";
import {Role, RolesService} from "../services/roles.service";
import {ModalTypes} from "../components/modal/modal-types";
import {UsersService} from "../services/users.service";
import {ModalService} from "../components/modal/modal.service";
import {map, tap} from "rxjs";
import {RolesModalComponent} from "./roles-modal/roles-modal.component";

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    WiTableComponent,
    RolesModalComponent
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {
  constructor(private rolesService: RolesService,
              private modalService: ModalService) {
  }
  ngOnInit() {
    this.refreshData();
  }
  private defaultTableQueryParams = {
    page: tableConfig.paginator.currentPage,
    limit: tableConfig.limit
  }
  private tableQueryParams: { [key: string]: any }  = {
    ...this.defaultTableQueryParams
  };

  tableConfig = tableConfig;
  tableData = signal<Role[]>([]);
  totalPages = signal(1);

  @ViewChild('modalTemplate', { static: true }) modalTemplate!: TemplateRef<any>;

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

  refreshData(tableQueryParams: any = null) {
    this.rolesService.getAll(tableQueryParams).pipe(
        tap(roles => {
          this.tableConfig.paginator.totalPages = roles.data.totalPages;
          this.totalPages.set(roles.data.totalPages);
        }),
        map(({data}) => data.roles)
    ).subscribe(data => {
      this.tableData.set(data);
    })
  }

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
            this.addNewUser(action.data);
          } else if (action.event === ModalTypes.UPDATE) {
            this.updateUser(action.data, action.data.id);
          }
        });
  };
  applySort(data: IFieldSortData) {
    this.tableQueryParams['sortBy'] = data.sortBy;
    this.tableQueryParams['sortOrder'] = data.sortOrder;
    this.refreshData(this.tableQueryParams);
  }
  addNewUser(data: any) {
    this.rolesService.create(data).subscribe(
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
    this.rolesService.update(newData, id).pipe(
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
