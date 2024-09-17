import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, Observable, of} from "rxjs";
import {ToastrService} from "ngx-toastr";

interface Materials {
  code: number;
  status: number;
  data: {
    currentPage: number,
    totalPages: number,
    materials: [],
  }
};

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  get(page = 1) {

    // return <Observable<Materials>>this.http.get(this.apiUrl+'/materials?page='+page);

    return this.http.get<Materials>(`${this.apiUrl}/materials?page=${page}`).pipe(
      catchError((error) => {
        this.toastr.error(error.error.message)

        // Return an empty array or fallback data in case of error
        const emptyMaterialObj = {
          data: {
            materials: [],
            totalPages: 0,
          }
        };

        return of(emptyMaterialObj);
      })
    );
  }

  addMaterial(data: any) {
    console.log('[addMaterial] data', data);
    return this.http.post(this.apiUrl+'/materials', data);
  }
}
