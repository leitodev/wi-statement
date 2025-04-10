import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {catchError, Observable, of, tap} from "rxjs";
import {Role} from "./roles.service";

export interface ob13j {
    "_id": "679bb8d5f8f9cb1164e8cb06",
    "userId": {
    "_id": "678a6b856d5999ee4ff3befb",
        "email": "andriy.hardy@gmail.com",
        "name": "Andriy",
        "role": "67af5d4f38b3e40c324e58b9"
},
    "action": "update",
    "entityType": "Material",
    "entityId": "6798fa6af16e00582adecd8b",
    "changes": {
    "before": {

    },
    "after": {

    },
    "diff": {

    }
},
    "timestamp": "2025-01-30T17:37:25.450Z",
    "createdAt": "2025-01-30T17:37:25.451Z",
    "updatedAt": "2025-01-30T17:37:25.451Z"
}
export interface UserLog{
    _id: string;
    email: string;
    name: string;
    role: string;
}
export interface LogChanges{
    before: Object;
    after: Object;
    diff: {
        description: {
            before: string;
            after: string;
        };
    };
}
export interface Log {
    _id: string,
    user: string,
    "action": string,
    "entityType": string,
    entityId: string,
    changes: LogChanges,
    timestamp: Date,
    createdAt: Date,
    updatedAt: Date,
}

export interface LogResponse {
  code: number;
  status: string;
  data: {
    log: Log,
  };
}

export interface LogsResponse {
    totalPages: number;
    currentPage: number;
    code: number;
    status: string;
    data: {
        currentPage: number;
        totalPages: number;
        logs: Log[];
    };
}

@Injectable({
  providedIn: 'root'
})
export class LogsService {
    private mockData = {
        status: "success",
        code: 200,
        data: {
            totalPages: 7,
            currentPage: 1,
            logs: [
                {
                    _id: "67cdf5b34c27d038a5a31c9d",
                    user: {
                        _id: "678a6b856d5999ee4ff3befb",
                        email: "andriy.hardy@gmail.com",
                        name: "Andriy",
                        role: "Admin"
                    },
                    action: "update",
                    entityType: "Material",
                    entityId: "67cdf5944c27d038a5a31c92",
                    changes: {
                        before: {
                            _id: "67cdf5944c27d038a5a31c92",
                            partNumber: "00000123",
                            description: "на входе",
                            supplier: "",
                            supplierId: null,
                            supplierItemNumber: "",
                            parentID: [],
                            countryOfOrigin: "",
                            status: "pending approval",
                            regulatoryCompliance: [],
                            BOMcomponent: "",
                            storagePath: "",
                            notes: "",
                            category: "other",
                            unitOfMeasure: "",
                            leadTime: "qwe",
                            customFields: {},
                            components: []
                        },
                        after: {
                            _id: "67cdf5944c27d038a5a31c92",
                            partNumber: "00000123",
                            description: "Огнетушитель на входе",
                            supplier: "",
                            supplierId: null,
                            supplierItemNumber: "",
                            parentID: [],
                            countryOfOrigin: "",
                            status: "pending approval",
                            regulatoryCompliance: [],
                            BOMcomponent: "",
                            storagePath: "",
                            notes: "",
                            category: "other",
                            unitOfMeasure: "",
                            leadTime: "qwe",
                            customFields: {},
                            components: []
                        },
                        diff: {
                            description: {
                                before: "на входе",
                                after: "Огнетушитель на входе"
                            }
                        }
                    },
                    timestamp: "2025-03-09T20:10:27.094Z",
                    createdAt: "2025-03-09T20:10:27.094Z",
                    updatedAt: "2025-03-09T20:10:27.094Z"
                },
            ],
        }
    };
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  // getAll(tableQueryParams: { [key: string]: any }){
  //   let params = new HttpParams();
  //   if (tableQueryParams) {
  //     for (const key in tableQueryParams) {
  //       if (tableQueryParams.hasOwnProperty(key) && tableQueryParams[key] !== undefined && tableQueryParams[key] !== null) {
  //         params = params.set(key, tableQueryParams[key]);
  //       }
  //     }
  //   }
  //
  //   return this.http.get<LogsResponse>(`${this.apiUrl}/roles/`, { params }).pipe(
  //       catchError((error) => {
  //         this.toastr.error(error.error.message)
  //         // Return an empty array or fallback data in case of error
  //         const emptyRolesObj = {
  //           data: {
  //             totalPages: 0,
  //             roles: [],
  //           }
  //         };
  //         return of(emptyRolesObj);
  //       })
  //   );
  // }

    getAll(tableQueryParams: { [key: string]: any }){
      return of(this.mockData);
    }

  get(id: string) {
    return this.http.get<LogResponse>(`${this.apiUrl}/roles/${id}`).pipe(
        catchError((error) => {
          this.toastr.error(error.error.message)
          return of({data: []});
        })
    );
  }

  create(roleData: any):Observable<any> {
    let body  = {
      ...roleData.form,
    };
    return this.http.post(this.apiUrl+'/roles', body).pipe(
        tap((res: any) => {
          if (res.code === 201) {
            this.toastr.success('Role has been successfully added');
          }
        }),
        catchError((error) => {
          this.toastr.error(error.error.message);
          return of(null);
        })
    );
  }

  update(roleData: any, id: string):Observable<any> {
    let body  = {
      ...roleData.form,
    };
    return this.http.put(this.apiUrl+'/roles/'+id, body).pipe(
        tap((res: any) => {
          if (res.code === 201) {
            this.toastr.success('Role has been successfully updated');
          }
        }),
        catchError((error) => {
          this.toastr.error(error.error.message);
          return of(null);
        })
    );
  }

  delete(roleId: string):Observable<any> {
    return this.http.delete<LogResponse>(`${this.apiUrl}/roles/${roleId}`).pipe(
        tap((res: any) => {
          if (res.code === 200){
            this.toastr.success('Role has been successfully deleted');
          }
        }),
        catchError((error) => {
          this.toastr.error(error.error.message)
          return of({data: []});
        })
    );
  }
}