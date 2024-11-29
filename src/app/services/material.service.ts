import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, of, tap} from "rxjs";
import {ToastrService} from "ngx-toastr";

export interface MaterialList {
  _id: string;
  partNumber: string,
  description: string,
  supplier: string,
  supplierItemNumber: string,
  parentID: string | null,
  components: [],
  countryOfOrigin: string,
  status: string,
  regulatoryCompliance: [],
  BOMcomponent: string,
  storagePath: string,
  createdAt: string,
  updatedAt: string
};

export interface MaterialsResponse {
  code: number;
  status: string;
  data: {
    currentPage: number,
    totalPages: number,
    materials: MaterialList[],
  }
};

interface foundMaterial {
  code: number;
  status: string;
  data: {
    material: {
      partNumber: number;
      description: string;
    },
  }
}

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  get(page = 1) {
    return this.http.get<MaterialsResponse>(`${this.apiUrl}/materials?page=${page}&limit=15`).pipe(
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
    return this.http.get<foundMaterial>(`${this.apiUrl}/materials/${id}`).pipe(
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
      supplierItemNumber: data.form.supplierItemNumber,
      countryOfOrigin: data.form.countryOfOrigin,
      BOMcomponent: data.form.BOMcomponent,
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

  changeCompliance(data: any) {
    const complianceList = data.complianceList.filter((item: any) => item.selected).map((compliance: any) => {
      return {regulationId: compliance.id, status: compliance.status.name}
    });

    const formData = data.form;
    const supplierID = data.modalData.supplierId;

    const body = new FormData();
    body.append('document', formData.file);
    body.append('documentTitle', formData.document_name);
    body.append('type', 'certificate');
    body.append('notes', formData.comments);
    body.append('regulations', JSON.stringify(complianceList));

    // TODO add supplierId for 'applyToAllSupplierMaterials'
    if (formData.applyStatusFor === 'current') {
      body.append('materialIds', JSON.stringify([data.modalData._id]));
    } else {
      body.append('supplierId', supplierID);
      body.append('applyToAllSupplierMaterials', 'true');
    }

    return this.http.put(this.apiUrl+'/materials/compliance', body).pipe(
      tap((res: any) => {
        if (res.code === 201) {
          this.toastr.success('Compliance has updated');
        }
      }),
      catchError((error) => {
        this.toastr.error(error.error.message);
        return of(null);
      })
    )
  };

  addNewCompliance(data: any) {
    const materialID = data.modalData._id;
    const supplierID = data.modalData.supplierId;
    const formData = data.form;

    const body = new FormData();
    body.append('document', formData.file);
    body.append('regulationTitle', formData.name);
    body.append('regulationDescription', formData.comments);
    body.append('documentTitle', formData.document_name);
    body.append('status', formData.status);

    if (formData.applyStatusFor === 'current') {
      body.append('materialId', materialID);
    } else {
      body.append('supplierId', supplierID);
      body.append('applyToAllSupplierMaterials', 'true');
    }

    return this.http.post(this.apiUrl+'/regulatories/with-document', body).pipe(
      tap((res: any) => {
        if (res.code === 201) {
          this.toastr.success('Compliance has been successfully added');
        }
      }),
      catchError((error) => {
        this.toastr.error(error.error.message);
        return of(null);
      })
    )
  }



}
