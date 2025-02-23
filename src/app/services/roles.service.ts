import { Injectable } from '@angular/core';
import {UserLocales} from "../users/enums/user-locales";
import {UserTimeZones} from "../users/enums/user-timezones";
import {UserStatuses} from "../users/enums/user-statuses";
import {UserRoles} from "../users/enums/user-roles";
import {Profile, User, UsersResponse} from "./users.service";
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {catchError, Observable, of, tap} from "rxjs";

export interface PageModule{
  view: boolean,
  create: boolean,
  update: boolean,
  delete: boolean
}
export interface Role{
  _id: string,
  name: string,
  description: string,
  permissions: { [key: string]: PageModule },
  globalPermissions: {
    canChangeUserRoles: boolean,
    canViewReports: boolean,
    canExport: boolean,
    canEditOwnProfile: boolean
  },
  createdAt: Date,
  updatedAt: Date,
}
export interface RoleResponse {
  code: number;
  status: string;
  data: {
    role: Role,
  };
}

export interface RolesResponse {
  totalPages: number;
  currentPage: number;
  code: number;
  status: string;
  data: {
    currentPage: number;
    totalPages: number;
    roles: Role[];
  };
}
@Injectable({
  providedIn: 'root'
})
export class RolesService {
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

    return this.http.get<RolesResponse>(`${this.apiUrl}/roles/`, { params }).pipe(
        catchError((error) => {
          this.toastr.error(error.error.message)
          // Return an empty array or fallback data in case of error
          const emptyUsersObj = {
            data: {
              totalPages: 0,
              roles: [],
            }
          };
          return of(emptyUsersObj);
        })
    );
  }

  get(id: string) {
    return this.http.get<RoleResponse>(`${this.apiUrl}/roles/${id}`).pipe(
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
    console.log('del')
    return this.http.delete<RoleResponse>(`${this.apiUrl}/roles/${roleId}`).pipe(
        catchError((error) => {
          this.toastr.error(error.error.message)
          return of({data: []});
        })
    );
  }
}
