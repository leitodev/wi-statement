import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {catchError, of} from "rxjs";
import {DiffColor} from "../utils/utils";

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

    // start generateLogs
    generateLogs(array: any): any {
        const result: any = {
            before: [],
            after: [],
            beforeDiff: [],
            afterDiff: [],
        };

        for (const { changesFull } of array) {
            const before = this.logsObjectGenerator(changesFull.before);
            const after = this.logsObjectGenerator(changesFull.after);

            const beforeDiff: any[] = [];
            const afterDiff: any[] = [];

            const isBeforeEmpty = !before.length;
            const isAfterEmpty = !after.length;

            if (isBeforeEmpty && !isAfterEmpty) {
                // Created items
                for (const item of after) {
                    item.styles.push(`bg-[${DiffColor.create}]`);
                    afterDiff.push(item);
                }
            } else if (!isBeforeEmpty && isAfterEmpty) {
                // Deleted items
                for (const item of before) {
                    item.styles.push(`bg-[${DiffColor.delete}]`);
                    beforeDiff.push(item);
                }
            } else {
                // Updated items
                for (let i = 0; i < before.length; i++) {
                    const beforeItem = before[i];
                    const afterItem = after[i];

                    if (
                        JSON.stringify(beforeItem) !== JSON.stringify(afterItem) &&
                        this.isNotEmpty(beforeItem) &&
                        this.isNotEmpty(afterItem)
                    ) {
                        beforeItem.styles.push(`bg-[${DiffColor.delete}]`);
                        afterItem.styles.push(`bg-[${DiffColor.create}]`);

                        beforeDiff.push(beforeItem);
                        afterDiff.push(afterItem);
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
    // end generateLogs

    prepareLog(logs: Log[]):LogTableItem[] {
        return logs.map((item:Log, index: number) => {
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
            return newLog;
        });
    }

    // start logsObjectGenerator
    private logsObjectGenerator(entryItem: any): any {
        try {
            if (!this.isNotEmpty(entryItem)) return [];

            // Handle object
            if (this.isObjectCheck(entryItem)) {
                const outputArray = Object.entries(entryItem).map(([key, value]) => {
                    const result = this.logsObjectGenerator(value);
                    const logEntry: any = {
                        title: key,
                        styles: [],
                        logs: [],
                        hasChildren: false,
                    };

                    if (!this.isNotEmpty(result)) {
                        logEntry.styles.push('italic');
                        logEntry.logs.push('empty');
                    } else if (this.isObjectCheck(result)) {
                        logEntry.hasChildren = true;
                        logEntry.logs.push(result);
                    } else if (this.isArrayCheck(result)) {
                        logEntry.hasChildren = true;
                        logEntry.logs.push(...result);
                    } else {
                        logEntry.logs.push(result);
                    }

                    return logEntry;
                });

                outputArray.sort((a, b) => this.logsSort(a, b));
                return outputArray;
            }

            // Handle array
            if (this.isArrayCheck(entryItem)) {
                return entryItem.map((item: any, index: number) => {
                    const result = this.logsObjectGenerator(item);
                    const logEntry: any = {
                        title: index,
                        styles: [],
                        logs: [],
                        hasChildren: false,
                    };

                    if (!this.isNotEmpty(result)) {
                        logEntry.styles.push('italic');
                        logEntry.logs.push('empty');
                    } else if (this.isArrayCheck(result) || this.isObjectCheck(result)) {
                        logEntry.hasChildren = true;
                        logEntry.logs.push(...(Array.isArray(result) ? result : [result]));
                    } else {
                        logEntry.logs.push(result);
                    }

                    return logEntry;
                });
            }

            return entryItem;
        } catch (error) {
            console.error('[logsObjectGenerator] Error:', error);
            return [];
        }
    }
    // end logsObjectGenerator

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
    // END

    // todo: use get
    // get(id: string) {
    //   return this.http.get<LogResponse>(`${this.apiUrl}/roles/${id}`).pipe(
    //       catchError((error) => {
    //         this.toastr.error(error.error.message)
    //         return of({data: []});
    //       })
    //   );
    // }

    // todo: use delete
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