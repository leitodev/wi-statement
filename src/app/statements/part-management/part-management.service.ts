import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PartManagementService {

  // 1 api full list of products without detailed components
  // 2 api SELECTED product or component with detailed components hierarchy
  // 3 api all available supplier list
  // 4 api SEARCH by product or component (search by Part Number or ID)



  // back update -> old structure + newStructure / post?id=12323 {} releateTO

  private partManagementData = [
    {
      parentID: null,
      id: 1,
      supplier: 'Rockstar Games',
      partNumber: '123SU152',
      plant: 'PLANT1',
      components: [
        {
          parentID: 1,
          id: 11,
          supplier: 'GTA San Diego',
          partNumber: '123SU15253',
          plant: 'PLANT21',
          components: [
            {
              parentID: 11,
              id: 111,
              supplier: 'GTA California',
              partNumber: '123SU1g5',
              components: [],
              description: 'gta California 2018',
              plant: 'PLAN33',
            },
          ],
          description: 'gta V 2014 desc!'
        },
        {
          parentID: 1,
          id: 12,
          supplier: 'RDR Dakota',
          partNumber: '123SU15212',
          components: [],
          description: 'rdr desc main 2',
          plant: 'PL12',
        },
      ],
      description: 'lorem text'
    },
    {
      parentID: null,
      id: 2,
      supplier: 'Activision',
      partNumber: 'W1889000001',
      components: [],
      description: 'decent description text',
      plant: 'plant123',
    },
    {
      parentID: 1,
      id: 11,
      supplier: 'GTA San Diego',
      partNumber: '123SU15253',
      components: [],
      description: 'gta V 2014 desc!',
      plant: 'plant413',
    },
    {
      parentID: 11,
      id: 111,
      supplier: 'GTA California',
      partNumber: '123SU1g5',
      components: [],
      description: 'gta California 2018',
      plant: 'plant5413',
    },
    {
      parentID: 1,
      id: 12,
      supplier: 'RDR Dakota',
      partNumber: '123SU15212',
      components: [],
      description: 'rdr desc main 2',
      plant: 'plant654',
    }
  ];

  getData() {
    return this.partManagementData;
  }

  constructor() { }
}
