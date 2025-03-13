import {Injectable} from '@angular/core';
import {UserLocales} from "../users/enums/user-locales";
import {UserTimeZones} from "../users/enums/user-timezones";
import {UserStatuses} from "../users/enums/user-statuses";
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {catchError, Observable, of, tap} from "rxjs";

export interface Profile{
  avatarUrl: string | null;
}

export interface Role{
  name: string;
  _id: string;
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
  role: Role;
  token: string | null;
}

export interface UserResponse {
  code: number;
  status: string;
  data: {
    user: User,
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
export interface RoleForDictionary {
  _id: string;
  name: string;
}
export  interface RolesForDictionaryResponse {
  code: number;
  status: string;
  data: {
    roles: RoleForDictionary[];
  };
}
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getAll(tableQueryParams: { [key: string]: any }) {
    let params = new HttpParams();
    if (tableQueryParams) {
      for (const key in tableQueryParams) {
        if (tableQueryParams.hasOwnProperty(key) && tableQueryParams[key] !== undefined && tableQueryParams[key] !== null) {
          params = params.set(key, tableQueryParams[key]);
        }
      }
    }

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
    return this.http.get<UserResponse>(`${this.apiUrl}/users/${id}`).pipe(
        catchError((error) => {
          this.toastr.error(error.error.message)
          return of({data: []});
        })
    );
  }

  getAllRoles():Observable<RolesForDictionaryResponse>{
    return this.http.get<RolesForDictionaryResponse>(`${this.apiUrl}/rolesForDictionary`).pipe(
      catchError((error) => {
        this.toastr.error(error.error.message);
        const emptyRolesObj = {data: {roles: [],}, code: 0, status: 'error'};
        return of(emptyRolesObj);
      })
    );
  }

  create(userData: any):Observable<any> {
    let avatarUrl = userData.form.avatarUrl;
    delete userData.form.avatarUrl;
    let body  = {
      ...userData.form,
      profile: {
        avatarUrl: avatarUrl,
      }
    };

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