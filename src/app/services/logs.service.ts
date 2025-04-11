import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {catchError, Observable, of, tap} from "rxjs";

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
export interface LogTable {
    code: number;
    status: string;
    data: {
        currentPage: number;
        totalPages: number;
        logs: LogTableItem[];
    };
}
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