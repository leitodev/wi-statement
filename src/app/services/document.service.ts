import { Injectable } from '@angular/core';
import {catchError, of} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";

export interface IDocument {
    _id: string,
    title: string,
    comments: string
    fileUrl?: string
    updatedAt: string,
    uploadedBy?: {
        name: string,
    },
}

export interface DocumentsResponse {
    code: number;
    status: string;
    data: {
        documents: IDocument[],
    }
};

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getDocuments(materialId: string, complianceId: string) {
    return this.http.get<DocumentsResponse>(`${this.apiUrl}/documents?materialId=${materialId}&regulationId=${complianceId}`).pipe(
      catchError((error) => {
        this.toastr.error(error.error.message)

        const emptyObj = {
          data: {
              documents: [],
          }
        };

        return of(emptyObj);
      })
    );
  }
}
