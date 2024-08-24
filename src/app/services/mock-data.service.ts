import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  allSuppliersData= [
    {id: 1, name: 'Activision'},
    {id: 2, name: 'Rockstar Games'},
    {id: 3, name: 'GTA San Diego'},
    {id: 4, name: 'RDR Dakota'},
    {id: 5, name: 'GTA California'},
  ];

   statusDataList = [
    {id: 1, name: "Rejected"},
    {id: 2, name: "Approved"},
    {id: 3, name: "Pending"}
  ];

  constructor() { }

  getSuppliers() {
    return this.allSuppliersData
  }
}
