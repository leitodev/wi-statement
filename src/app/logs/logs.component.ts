import {Component, signal, TemplateRef, ViewChild} from '@angular/core';
import {CellColor, IFieldSortData, WiTableComponent} from "../components/wi-table/wi-table.component";
import {ModalService} from "../components/modal/modal.service";
import {map, Observable, tap} from "rxjs";
import {ModalTypes} from "../components/modal/modal-types";
import {Log, LogsResponse, LogsService, LogTableItem} from "../services/logs.service";
import tableConfig from "./table-config";
import {LogsModalComponent} from "./logs-modal/logs-modal.component";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [
    LogsModalComponent,
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
  logsTree: any = [];

  @ViewChild('modalTemplate', { static: true }) modalTemplate!: TemplateRef<any>;

  tableEvent(event: any) {
    if (event.eventName == 'changePage') {
      this.tableQueryParams['page'] = event.data;
      this.refreshData(this.tableQueryParams);
    }

    if (event.eventName === 'applySort' && event.data?.sortBy) {
      this.applySort(event.data);
    }

    if (['tableRowCLick', 'tableRowEditBtn', 'tableRowLogInfoBtn'].includes(event.eventName)) {
      this.openModal(this.modalTemplate, event.data);
    }

  };

  refreshData(tableQueryParams: any = null) {
    this.logsService.getAll(tableQueryParams).pipe(
        tap((logs: any) => {
          this.tableConfig.paginator.totalPages = logs.data.totalPages;
          this.totalPages.set(logs.data.totalPages);
        }),
        map(({data}: LogsResponse) => {
          let logsResponse: any = data.logs;
          logsResponse = logsResponse.map((item:Log, index: number)=> {
            let newLog: LogTableItem = {
              action: item.action,
              entityType: item.entityType,
              changes: item.changes?.diff ? Object.keys(item.changes.diff).join(', '): '',
              userId: item.user._id,
              userEmail: item.user.email,
              userName: item.user.name,
              userRole: item.user.role,
              timestamp: new Date(item.timestamp).toLocaleString('uk-UA', { // todo: Залежно від аккаунту current user змінювати locale 'uk-UA'
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }),
              changesFull: item.changes,
              logIndex: index,
              _id: item._id,
            }
            console.log('DATA', item);

            return newLog;
          });
          return logsResponse;
        }),
    ).subscribe(data => {
      this.tableData.set(data);
      this.logsTree = this.logsService.generateLogs(data);
    })
  }

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