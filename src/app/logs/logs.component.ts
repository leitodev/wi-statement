import {Component, signal, TemplateRef, ViewChild} from '@angular/core';
import {CellColor, IFieldSortData, WiTableComponent} from "../components/wi-table/wi-table.component";
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

  logsObjectGenerator(entryItem: any){ // [k {o: 1} [l l l] k]
    let outputArray: any = [];
    try {
      // Not empty
      if (this.isNotEmpty(entryItem)) {
        // Object
        if (this.isObjectCheck(entryItem)) {
          for (let key in entryItem) {
            let recursionObject: any = {
              title: key,
              styles: [],
              logs: [],
              hasChildren: false,
            };

            let res = this.logsObjectGenerator(entryItem[key]);
            if (!this.isNotEmpty(res)){
              recursionObject.styles.push('italic');
              recursionObject.logs.push('empty');
            }
            else if (this.isObjectCheck(res)){
              recursionObject.hasChildren = true;
              recursionObject.logs.push(res);
            }
            else if (this.isArrayCheck(res)) {
              recursionObject.hasChildren = true;
              recursionObject.logs.push(...res);
            }
            else {
              recursionObject.logs.push(res);
            }
            outputArray.push(recursionObject);
          }
        }
        // Array
        else if (this.isArrayCheck(entryItem)) {
          let recursionObjectArray: any = []
          for (let i = 0; i < entryItem.length; i++) {
            let recursionObject: any = {
              title: i,
              styles: [],
              logs: [],
              hasChildren: false,
            };

            let res: any = this.logsObjectGenerator(entryItem[i]);
            if (!this.isNotEmpty(res)){
              recursionObject.styles.push('italic');
              recursionObject.logs.push('empty');
            }
            else if (this.isArrayCheck(res) || this.isObjectCheck(res)) {
              recursionObject.hasChildren = true;
              recursionObject.logs.push(...res);
            }
            else {
              recursionObject.logs.push(res);
            }
            recursionObjectArray.push(recursionObject);
          }
          return recursionObjectArray;
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

  generateLogs(array: any) {
    let result: any = {
      before: [],
      after: [],
      beforeDiff: [],
      afterDiff: [],
    };
    for(let data of array) {
      let before = this.logsObjectGenerator(data.changesFull.before);
      let after = this.logsObjectGenerator(data.changesFull.after);

      let beforeDiff = [];
      let afterDiff = [];

      // Item created
      if(!before.length && after.length){
        for(let i = 0; i < after.length; i++) {
          after[i].styles.push(`bg-[${CellColor.create}]`);
          afterDiff.push(after[i]);
        }
      }
      // Item deleted
      else if(before.length && !after.length){
        for(let i = 0; i < before.length; i++) {
          before[i].styles.push(`bg-[${CellColor.delete}]`);
          beforeDiff.push(before[i]);
        }
      }
      // Item updated
      else{
        for(let i = 0; i < before.length; i++) {
          if((JSON.stringify(before[i]) != JSON.stringify(after[i])) && this.isNotEmpty(before[i]) && this.isNotEmpty(after[i])) {
            
            before[i].styles.push(`bg-[${CellColor.create}]`);
            after[i].styles.push(`bg-[${CellColor.delete}]`);

            beforeDiff.push(before[i]);
            afterDiff.push(after[i]);
          }
        }
      }
      result.before.push(before);
      result.after.push(after);
      result.beforeDiff.push(beforeDiff);
      result.afterDiff.push(afterDiff);
    }
    return result;
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
        map(({data}, index) => {
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
              logIndex: index,
            }
            return newLog;
          });
          return logsResponse;
        }),
    ).subscribe(data => {
      this.tableData.set(data);
      this.logsTree = this.generateLogs(data);
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