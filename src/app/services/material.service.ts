import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, of, tap} from "rxjs";
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

interface findedMaterial {
  code: number;
  status: number;
  data: {
    material: {
      partNumber: number;
      description: string;
    },
  }
}

// interface newMaterial {
//   partNumber: string;
//   description: string;
//   status: string;
//   supplier: string;
//   parentID: null | string;
// }

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  get(page = 1) {

    // return <Observable<Materials>>this.http.get(this.apiUrl+'/materials?page='+page);
    // ${this.apiUrl}/materials?page=${page}
    return this.http.get<Materials>(`${this.apiUrl}/materials?page=${page}&limit=15`).pipe(
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

  searchByPartNumber(partNumber: number | string) {
    return this.http.get<{data: any[]}>(`${this.apiUrl}/materials/search?partNumber=${partNumber}`).pipe(
      catchError((error) => {
        this.toastr.error(error.error.message)
        return of({data: []});
      })
    );
  }

  searchById(id: number | string) {
    return this.http.get<findedMaterial>(`${this.apiUrl}/materials/${id}`).pipe(
      catchError((error) => {
        this.toastr.error(error.error.message)
        return of({
          data: {
            material: {
              partNumber: '',
              description: error.error.message
            }
          }
        });
      })

    )
  }

  addMaterial(data: any) {
    const body  = {
      ...data.form,
      parentID: data.isParentChosen ? data.isParentChosen.id : null
    };

    return this.http.post(this.apiUrl+'/materials', body).pipe(
      tap((res: any) => {
        if (res.code === 201) {
          this.toastr.success('Material has been successfully added');
        }
      }),
      catchError((error) => {
        this.toastr.error(error.error.message);
        return of(null);
      })
    )

  }

  update(id: any, data: any) {

    let body: any = {
      partNumber: data.form.partNumber,
      description: data.form.description,
      status: data.form.status,
      supplier: data.form.supplier,
    }

    if (data.isParentChosen) {
      body['relatedParentId'] = data.isParentChosen.id;
    }
    return this.http.put(this.apiUrl+'/materials/'+id, body).pipe(
      tap((res: any) => {
        if (res.code === 200) {
          this.toastr.success('Material has been successfully updated');
        }
      }),
      catchError((error) => {
        this.toastr.error(error.error.message);
        return of(null);
      })
    );
  }
}
