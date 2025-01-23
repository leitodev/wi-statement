import {Component, computed, signal, TemplateRef, ViewChild} from '@angular/core';
import {MaterialsFilterComponent} from "../statements/part-management/materials-filter/materials-filter.component";
import {ProductModalComponent} from "../statements/part-management/product-modal/product-modal.component";
import {WiTableComponent} from "../components/wi-table/wi-table.component";
import tableConfig from "./table-config";
import {MaterialList, MaterialService} from "../services/material.service";
import {User, UsersResponse, UsersService} from "../services/users.service";
import {ModalTypes} from "../components/modal/modal-types";
import {ModalService} from "../components/modal/modal.service";
import {MockDataService} from "../services/mock-data.service";
import {UsersModalComponent} from "./users-modal/users-modal.component";
import {map, of, tap} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    WiTableComponent,
    UsersModalComponent
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
            this.updateUser(action.data.id, action.data);
          }
        });
  };
  tableEvent(event: any) {
    if (event.eventName == 'changePage') {
      this.tableQueryParams['page'] = event.data;
      this.refreshData(this.tableQueryParams);
    }
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
    this.refreshData();
  }
  refreshData(tableQueryParams: any = null) {
    this.usersService.getAllUsers(tableQueryParams).pipe(
        tap(users => {
          this.tableConfig.paginator.totalPages = users.data.totalPages;
          this.totalPages.set(users.data.totalPages);
        }),
        map(result => result.data),
        map(data => data.users)
    ).subscribe(data => {
      this.tableData.set(data);
    })
  }
  constructor(private usersService: UsersService,
              private modalService: ModalService) {
  }
  addNewUser(data: any) {
    this.usersService.createUser(data).subscribe(
        {
          next: res => {
            console.log("User created successfully:", res);
            // todo: delete when Back will change 'id' to '_id'
            let _id = res.data.user.id;
            let newUser = {
              _id: _id,
              ...res.data.user,
            }
            delete newUser.id;

            console.log(newUser);
            this.tableData.update((val)=> [...val, newUser]);
          },
          error: err => {
            if(err.code == 409) console.log("User already exists!");
            else console.log('User creation error:', err);
          },
        }
    );
    this.modalService.closeModal();
  }
  updateUser(newData: User, id: string){
    this.usersService.updateUser(newData, id);
    this.modalService.closeModal();
  }
}