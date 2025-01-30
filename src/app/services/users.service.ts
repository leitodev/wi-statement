import {Injectable, signal, WritableSignal} from '@angular/core';
import {UserLocales} from "../users/enums/user-locales";
import {UserTimeZones} from "../users/enums/user-timezones";
import {UserStatuses} from "../users/enums/user-statuses";
import {UserRoles} from "../users/enums/user-roles";
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {catchError, Observable, of, tap} from "rxjs";
import {MaterialsResponse} from "./material.service";

export interface Profile{
  avatarUrl: string | null;
}

export interface User{
  _id: string;
  password: string;
  email: string;
  name: string;
  surname: string;
  locale: UserLocales;
  timezone: UserTimeZones;
  profile: Profile;
  status: UserStatuses;
  emailVerified: boolean;
  lastLoginAt: Date | null;
  role: UserRoles;
  token: string | null;
}

export interface UserResponse {
  code: number;
  status: string;
  data: {
    user: {},
  };
}

export interface UsersResponse {
  totalPages: number;
  currentPage: number;
  code: number;
  status: string;
  data: {
    currentPage: number;
    totalPages: number;
    users: User[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) { }
  // todo: delete it
  test(){
    this.http.get<UsersResponse>(`${this.apiUrl}/users/?page=2&limit=10`).subscribe({
      next: (val)=>console.log(val)
    });
  }

  getAll(tableQueryParams: { [key: string]: any }) {
    let params = new HttpParams();
    if (tableQueryParams) {
      for (const key in tableQueryParams) {
        if (tableQueryParams.hasOwnProperty(key) && tableQueryParams[key] !== undefined && tableQueryParams[key] !== null) {
          params = params.set(key, tableQueryParams[key]);
        }
      }
      console.log('params', params);
    }
    // ?page=2&limit=10
    return this.http.get<UsersResponse>(`${this.apiUrl}/users/`, { params }).pipe(
        catchError((error) => {
          this.toastr.error(error.error.message)
          // Return an empty array or fallback data in case of error
          const emptyUsersObj = {
            data: {
              totalPages: 0,
              users: [],
            }
          };
          return of(emptyUsersObj);
        })
    );
  }
  get(id: string) {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
        catchError((error) => {
          this.toastr.error(error.error.message)
          return of({data: []});
        })
    );
  }
  // toastr
  create(userData: any):Observable<any> {
    let avatarUrl = userData.form.avatarUrl;
    delete userData.form.avatarUrl;
    let body  = {
      ...userData.form,
      profile: {
        avatarUrl: avatarUrl,
      }
    };

    // this.http.post(this.apiUrl+'/users', body).pipe(
    //     tap((res: any) => {
    //       if (res.code === 201) {
    //         this.toastr.success('User has been successfully added');
    //       }
    //     }),
    //     catchError((error) => {
    //       this.toastr.error(error.error.message);
    //       return of(null);
    //     })
    // )

    return this.http.post(this.apiUrl+'/users', body).pipe(
        tap((res: any) => {
          if (res.code === 201) {
            this.toastr.success('User has been successfully added');
          }
        }),
        catchError((error) => {
          this.toastr.error(error.error.message);
          return of(null);
        })
    );
  }

  update(userData: any, id: string):Observable<any> {
    let avatarUrl = userData.form.avatarUrl;
    delete userData.form.avatarUrl;
    let body  = {
      ...userData.form,
      profile: {
        avatarUrl: avatarUrl,
      }
    };
    return this.http.put(this.apiUrl+'/users/'+id, body).pipe(
        tap((res: any) => {
          if (res.code === 201) {
            this.toastr.success('User has been successfully updated');
          }
        }),
        catchError((error) => {
          this.toastr.error(error.error.message);
          return of(null);
        })
    );
  }
}