import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {catchError, of} from "rxjs";

interface Suppliers {
  code: number;
  status: number;
  data: {
    currentPage: number,
    totalPages: number,
    suppliers: [{
      _id: number,
      name: string
    }],
  }
};

const emptySuppliersObj = {
  data: {
    suppliers: [
      {
        _id: 1,
        name: ''
      }
    ],
    totalPages: 0,
  }
};

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getAll() {
    return this.http.get<Suppliers>(`${this.apiUrl}/suppliers`).pipe(
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
