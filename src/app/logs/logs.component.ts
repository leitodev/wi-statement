import {Component, signal, TemplateRef, ViewChild} from '@angular/core';
import {RolesModalComponent} from "../roles/roles-modal/roles-modal.component";
import {IFieldSortData, WiTableComponent} from "../components/wi-table/wi-table.component";
import {ModalService} from "../components/modal/modal.service";
import {map, tap} from "rxjs";
import {ModalTypes} from "../components/modal/modal-types";
import {Log, LogsService} from "../services/logs.service";
import tableConfig from "./table-config";

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [
    RolesModalComponent,
    WiTableComponent
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent {
  constructor(private logsService: LogsService,
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
  tableData = signal<Log[]>([]);
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
    this.logsService.getAll(tableQueryParams).pipe(
        tap(logs => {
          this.tableConfig.paginator.totalPages = logs.data.totalPages;
          this.totalPages.set(logs.data.totalPages);
        }),
        map(({data}) => data.logs)
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
          if (action.event === ModalTypes.DELETE) {
            // this.deleteRole(action.data);
          }
        });
  };
  applySort(data: IFieldSortData) {
    this.tableQueryParams['sortBy'] = data.sortBy;
    this.tableQueryParams['sortOrder'] = data.sortOrder;
    this.refreshData(this.tableQueryParams);
  }

  // deleteRole(data: any) {
  //   let result = confirm(`Delete role "${data.form.name}" (${data.id})?`);
  //   if(result) this.logsService.delete(data.id).subscribe(
  //       (result: any) =>
  //       {
  //         if (result) {
  //           this.refreshData();
  //           this.modalService.closeModal();
  //         }
  //       }
  //   );
  // }
}