import {Component, signal, TemplateRef, ViewChild} from '@angular/core';
import {MaterialsFilterComponent} from "../statements/part-management/materials-filter/materials-filter.component";
import {ProductModalComponent} from "../statements/part-management/product-modal/product-modal.component";
import {WiTableComponent} from "../components/wi-table/wi-table.component";
import tableConfig from "./table-config";
import {MaterialList, MaterialService} from "../services/material.service";
import {User, UsersService} from "../services/users.service";
import {ModalTypes} from "../components/modal/modal-types";
import {ModalService} from "../components/modal/modal.service";
import {MockDataService} from "../services/mock-data.service";
import {UsersModalComponent} from "./users-modal/users-modal.component";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    // MaterialsFilterComponent,
    // ProductModalComponent,
    WiTableComponent,
    UsersModalComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  tableConfig = tableConfig;
  tableData = signal<User[]>([]);
  totalPages = signal(1);
  isFilterVisible = false;

  @ViewChild('modalTemplate', { static: true }) modalTemplate!: TemplateRef<any>;
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
          // General Modal Events
          console.log(action.event);
          if (action.event === ModalTypes.NEW) {
            this.addNewUser(action.data);
          } else if (action.event === ModalTypes.UPDATE) {
            // this.updateMaterial(action.data.id, action.data);
          }

          // Custom tabs events
          // if (action.data && action.data.tabActive) {
          //   if (action.data.state === 'addNewCompliance') {
          //     this.addNewCompliance(action.data);
          //   }
          //
          //   if (action.data.state === 'changeCompliance') {
          //     this.changeCompliance(action.data);
          //   }
          //   return;
          // }
        });
  };

  tableEvent(event: any) {
    // if (event.eventName == 'changePage') {
    //   this.tableQueryParams['page'] = event.data;
    //   this.refreshData(this.tableQueryParams);
    // }
    //
    // if (event.eventName === 'applySort' && event.data?.sortBy) {
    //   this.applySort(event.data);
    // }
    //
    if (['tableRowCLick', 'tableRowEditBtn'].includes(event.eventName)) {
      this.openModal(this.modalTemplate, event.data);
    }
  };
  ngOnInit() {
    this.tableData = this.usersService.getAllUsers();
  }

  constructor(private usersService: UsersService,
              private modalService: ModalService,) {
  }

  addNewUser(data: any) {
    this.usersService.createUser(data);
    this.modalService.closeModal();
  }
}
