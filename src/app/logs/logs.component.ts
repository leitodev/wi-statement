import {Component, signal, TemplateRef, ViewChild} from '@angular/core';
import {IFieldSortData, WiTableComponent} from "../components/wi-table/wi-table.component";
import {ModalService} from "../components/modal/modal.service";
import {map, tap} from "rxjs";
import {ModalTypes} from "../components/modal/modal-types";
import {Log, LogsService, LogTableItem} from "../services/logs.service";
import tableConfig from "./table-config";
import {LogsModalComponent} from "./logs-modal/logs-modal.component";

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

  logsObjectGenerator(entryItem: any){
    let outputArray: any = [];
    try {
      // Not empty
      if (this.isNotEmpty(entryItem)) {
        // Object
        if (this.isObjectCheck(entryItem)) {
          for (let key in entryItem) {
            let recursionObject: any = {};
            recursionObject.styles = [];
            recursionObject.logs = [];
            recursionObject.title = key;
            let res = this.logsObjectGenerator(entryItem[key]);
            if (this.isNotEmpty(res)) {
              recursionObject.logs.push(res);
            }
            else {
              recursionObject.styles.push('empty');
              recursionObject.logs.push('empty');
            }
            outputArray.push(recursionObject);
          }
        }
        // Array
        else if (this.isArrayCheck(entryItem)) {
          for (let item of entryItem) {
            let res = this.logsObjectGenerator(item);
            if (this.isNotEmpty(res)) outputArray.push(res);
          }
        }
        // Item
        else {
          return entryItem;
        }
      }
    }
    catch (error) {
      console.error('Log Error:', error);
    }
    return outputArray;
  }

  isArrayCheck(item: any): boolean {
    return Array.isArray(item)
  }
  isNotEmpty(item: any): boolean {
    if (Array.isArray(item)) {
      return item.length > 0;
    } else if (item && typeof item === 'object') {
      return Object.keys(item).length > 0;
    } else if (typeof item === 'boolean') {
      return true; // treat both true and false as 'not empty'
    }
    return !!item; // string, number, etc.
  }
  isObjectCheck(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  refreshData(tableQueryParams: any = null) {
    this.logsService.getAll(tableQueryParams).pipe(
        tap(logs => {
          this.tableConfig.paginator.totalPages = logs.data.totalPages;
          this.totalPages.set(logs.data.totalPages);
        }),
        map(({data}) => {
          let logsResponse: any = data.logs;
          logsResponse = logsResponse.map((item:Log)=> {
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
            }
            return newLog;
          });
          return logsResponse;
        }),
    ).subscribe(data => {
      this.tableData.set(data);
      console.log('Final', this.logsObjectGenerator(data[1].changesFull));
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