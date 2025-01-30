import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {catchError, of} from "rxjs";

export interface SuppliersResponse {
  code: number;
  status: string;
  data: {
    currentPage: number,
    totalPages: number,
    suppliers: Supplier[],
  }
}

export interface Supplier {
  _id: string,
  name: string,
  email: string,
  countryOfOrigin: string,
  notes: string,
  status: string,
  contactPerson: any[],
  factories: any[],
  licensesAndCertifications: any[],
  files: any[],
  createdAt: string,
  updatedAt: string,

}
export interface SuppliersDictionaries {
  code: number;
  status: number;
  data: {
    currentPage: number,
    totalPages: number,
    suppliers: [{
      _id: string,
      name: string
    }],
  }
};

const emptySuppliersObj = {
  data: {
    suppliers: [],
    totalPages: 0,
  }
};

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  //TODO ASK MAX /suppliers for dictionary

  getAll() {
    return this.http.get<SuppliersDictionaries>(`${this.apiUrl}/suppliers`).pipe(
      catchError((error) => {
        this.toastr.error(error.error.message)
        return of(emptySuppliersObj);
      })
    );
  }

  get(tableQueryParams: { [key: string]: any }) {
    let params = new HttpParams();
    if (tableQueryParams) {
      for (const key in tableQueryParams) {
        if (tableQueryParams.hasOwnProperty(key) && tableQueryParams[key] !== undefined && tableQueryParams[key] !== null) {
          params = params.set(key, tableQueryParams[key]);
        }
      }
    }
    return this.http.get<SuppliersResponse>(`${this.apiUrl}/suppliers`, { params }).pipe(
      catchError((error) => {
        this.toastr.error(error.error.message)
        return of(emptySuppliersObj);
      })
    );
  }

  getByName(name: string) {
    return this.http.get<{data: any[]}>(`${this.apiUrl}/suppliers/search?name=${name}`).pipe(
      catchError((error) => {
        this.toastr.error(error.error.message)
        return of({data: []});
      })
    );
  }
}
