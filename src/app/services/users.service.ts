import {Injectable, signal, WritableSignal} from '@angular/core';
import {UserLocales} from "../users/enums/user-locales";
import {UserTimeZones} from "../users/enums/user-timezones";
import {UserStatuses} from "../users/enums/user-statuses";
import {UserRoles} from "../users/enums/user-roles";
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {catchError, Observable, of} from "rxjs";
import {MaterialList, MaterialsResponse, RegulationsResponse} from "./material.service";

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

export interface UsersResponse {
  code: number;
  status: string;
  data: User[];
  totalPages: number;
  currentPage: number;
};
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getAllUsers(){
    return this.http.get(this.apiUrl+'/users').pipe(
        catchError((error) => {
          this.toastr.error(error.error.message)

          const emptyUsersObj = {
            data: {
              regulations: [],
            }
          };

          return of(emptyUsersObj);
        })
    );
  }
  getUser(id: string) {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
        catchError((error) => {
          this.toastr.error(error.error.message)
          return of({data: []});
        })
    );
  }
  createUser(userData: any) {

  }
}

