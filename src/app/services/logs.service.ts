import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {catchError, map, Observable, of, tap} from "rxjs";
import {CellColor} from "../components/wi-table/wi-table.component";

// user structure from API
export interface LogUser{
    _id: string;
    email: string;
    name: string;
    role: string;
}

// changes structure from API
export interface LogChanges{
    before?: Object;
    after?: Object;
    diff?: Object;
}

// log structure from API
export interface Log {
    _id: string,
    user: LogUser,
    action: string,
    entityType: string,
    entityId: string,
    changes?: LogChanges,
    timestamp: string,
    createdAt?: string,
    updatedAt?: string,
}

// Response from get() API
export interface LogResponse {
  code: number;
  status: string;
  data: {
    log: Log,
  };
}

// Response from getAll() API
export interface LogsResponse {
    code: number;
    status: string;
    data: {
        currentPage: number;
        totalPages: number;
        logs: Log[];
    };
}

// Changed Log structure for Wi-Table component
export interface LogTableItem {
    action: string,
    entityType: string,
    changes: string,
    userId: string,
    userEmail: string,
    userName: string,
    userRole: string,
    timestamp: string,
    changesFull?: LogChanges,
    logIndex: number,
    _id: string,
}

@Injectable({
  providedIn: 'root'
})
export class LogsService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private toastr: ToastrService) { }

    getAll(tableQueryParams: { [key: string]: any }){
        let params = new HttpParams();
        if (tableQueryParams) {
          for (const key in tableQueryParams) {
            if (tableQueryParams.hasOwnProperty(key) && tableQueryParams[key] !== undefined && tableQueryParams[key] !== null) {
              params = params.set(key, tableQueryParams[key]);
            }
          }
        }

        return this.http.get<LogsResponse>(`${this.apiUrl}/logs/`, { params }).pipe(
            catchError((error) => {
              this.toastr.error(error.error.message)
              // Return an empty array or fallback data in case of error
              const emptyLogsObj = {
                data: {
                  totalPages: 0,
                  logs: [],
                }
              };
              return of(emptyLogsObj);
            })
        );
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

                        before[i].styles.push(`bg-[${CellColor.delete}]`);
                        after[i].styles.push(`bg-[${CellColor.create}]`);

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
    private logsObjectGenerator(entryItem: any){
        let outputArray: any = [];
        try {
            if (!this.isNotEmpty(entryItem)) return []; // Empty
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
        catch (error) {
            console.error('Log Error:', error);
        }
        outputArray.sort((a: any, b: any) => this.logsSort(a, b));
        return outputArray;
    }
    private isArrayCheck(item: any): boolean {
        return Array.isArray(item)
    }
    private isNotEmpty(item: any): boolean {
        if (Array.isArray(item)) {
            return item.length > 0;
        } else if (item && typeof item === 'object') {
            return Object.keys(item).length > 0;
        } else if (typeof item === 'boolean') {
            return true; // treat both true and false as 'not empty'
        }
        return !!item; // string, number, etc.
    }
    private isObjectCheck(value: any): boolean {
        return value && typeof value === 'object' && !Array.isArray(value);
    }
    private logsSort(a: any, b: any): number {
        const extractTitle = (item: any) => {
            if (typeof item === 'object' && item !== null && 'title' in item) {
                return item.title.toString();
            }
            return item?.toString?.() ?? '';
        }

        return extractTitle(a).localeCompare(extractTitle(b));
    }

    // get(id: string) {
  //   return this.http.get<LogResponse>(`${this.apiUrl}/roles/${id}`).pipe(
  //       catchError((error) => {
  //         this.toastr.error(error.error.message)
  //         return of({data: []});
  //       })
  //   );
  // }

    // delete():Observable<any> {
    //   return this.http.delete<LogResponse>(`${this.apiUrl}/logs/cleanup`).pipe(
    //       tap((res: any) => {
    //         if (res.code === 200){
    //           this.toastr.success('Logs have been successfully deleted');
    //         }
    //       }),
    //       catchError((error) => {
    //         this.toastr.error(error.error.message)
    //         return of({data: []});
    //       })
    //   );
    // }
}