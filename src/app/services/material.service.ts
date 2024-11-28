import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, of, tap} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

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
    console.log('service ____changeCompliance data', data);

    const complianceList = data.complianceList.filter((item: any) => item.selected).map((compliance: any) => {
      return {regulationId: compliance.id, status: compliance.status.name}
    });
    /*
    data:
    {

    "tabActive": "Compliance",
    "state": "changeCompliance",
    "form": {
        "status": "pending",
        "applyStatusFor": "current",
        "document_name": "document2",
        "name": "",
        "comments": "commenwx",
        "file": {}
    },
    }
}

    */

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

    console.log('body [FormData]', body);

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

    console.log('service ____addNewCompliance data', data);

    const materialID = data.modalData._id;
    const supplierID = data.modalData.supplierId;
    const formData = data.form;

    const body = new FormData();
    body.append('document', formData.file);
    body.append('regulationTitle', formData.name);
    body.append('regulationDescription', formData.comments);
    body.append('documentTitle', formData.document_name);
    body.append('status', formData.status);



    /*

    {
    "complianceList": null,
    "tabActive": "Compliance",
    "state": "addNewCompliance",
    "form": {
        "status": "comply",
        "applyStatusFor": "forThisSupplier",
        "document_name": "DocNamwe",
        "name": "TestName1",
        "comments": "commenrew",
        "file": {}
    },
    "modalData": {
        "_id": "672934e9c627e49202beec97",
        "partNumber": "50101073A",
        "description": "20MM STOPPER, OMNI FLEX 3G IGLOO LYO",
        "supplier": "Datwyler",
        "supplierItemNumber": "",
        "parentID": [
            "67293518c627e49202beec9f"
        ],
        "countryOfOrigin": "",
        "status": "active",
        "BOMcomponent": "",
        "storagePath": "",
        "components": [],
        "regulatoryCompliance": [
            {
                "_id": "66d74d37c32d0715a4ff7a7b",
                "title": "EU REACH",
                "description": "Regulation concerning the Registration, Evaluation, Authorisation and Restriction of Chemicals",
                "status": "comply"
            },
            {
                "_id": "66eaf1bf90623cac72482436",
                "title": "EU RoHS",
                "description": "Restriction of Hazardous Substances in Electrical and Electronic Equipment (RoHS)",
                "status": "does_not_comply"
            },
            {
                "_id": "670fed898818777806d4dee5",
                "title": "PFAS",
                "description": "Per- and polyfluoroalkyl substances (PFAS) are a group of synthetic chemicals that are resistant to heat, grease, water, and oil. They are also known as forever chemicals because they do not break down in the environment.",
                "status": "does_not_comply"
            },
            {
                "_id": "6734f0ffd42a55488ee1ac68",
                "title": "TSCA",
                "description": "The TSCA PBT regulation",
                "status": "comply"
            },
            {
                "_id": "67420ad68701c08ccb019f04",
                "title": "namewq123",
                "description": "commwe3",
                "status": "comply"
            },
            {
                "_id": "6742311d8701c08ccb01a080",
                "title": "newComplianceName",
                "description": "coedmflkesmflkemsjkf",
                "status": "does_not_comply"
            },
            {
                "_id": "674497ed8701c08ccb01a0c2",
                "title": "name8888",
                "description": "8w8d8w8dw8w8d8d",
                "status": "na"
            }
        ],
        "createdAt": "2024-11-04T20:56:09.273Z",
        "updatedAt": "2024-11-26T16:23:17.669Z",
        "supplierId": "66eaf850a6c5520535b3a0e6"
    }
}

    */

    // TODO add supplierId for 'applyToAllSupplierMaterials'
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
