import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {catchError, Observable, of, tap} from "rxjs";

// user structure from API
export interface LogUser{
    _id: string;
    email: string;
    name: string;
    role: string;
}

// changes structure from API
export interface LogChanges{
    before: Object;
    after: Object;
    diff: Object;
}

// log structure from API
export interface Log {
    _id: string,
    user: LogUser,
    action: string,
    entityType: string,
    entityId: string,
    changes?: LogChanges,
    timestamp: string,
    createdAt?: string,
    updatedAt?: string,
}

// Response from get() API
export interface LogResponse {
  code: number;
  status: string;
  data: {
    log: Log,
  };
}

// Response from getAll() API
export interface LogsResponse {
    code: number;
    status: string;
    data: {
        currentPage: number;
        totalPages: number;
        logs: Log[];
    };
}

// Changed Log structure for Wi-Table component
export interface LogTable {
    code: number;
    status: string;
    data: {
        currentPage: number;
        totalPages: number;
        logs: LogTableItem[];
    };
}
export interface LogTableItem {
    action: string,
    entityType: string,
    changes: string,
    userId: string,
    userEmail: string,
    userName: string,
    userRole: string,
    timestamp: string,
}

@Injectable({
  providedIn: 'root'
})
export class LogsService {
    mockData:LogsResponse = {
        status: "success",
        code: 200,
        data: {
            totalPages: 1,
            currentPage: 1,
            logs: [
                {
                    "_id": "67cdf5b34c27d038a5a31c9d",
                    "user": {
                        "_id": "678a6b856d5999ee4ff3befb",
                        "email": "andriy.hardy@gmail.com",
                        "name": "Andriy",
                        "role": "Admin"
                    },
                    "action": "update",
                    "entityType": "Material",
                    "entityId": "67cdf5944c27d038a5a31c92",
                    "changes": {
                        "before": {
                            "_id": "67cdf5944c27d038a5a31c92",
                            "partNumber": "00000123",
                            "description": "на входе",
                            "supplier": "",
                            "supplierId": null,
                            "supplierItemNumber": "",
                            "parentID": [],
                            "countryOfOrigin": "",
                            "status": "pending approval",
                            "regulatoryCompliance": [],
                            "BOMcomponent": "",
                            "storagePath": "",
                            "notes": "",
                            "category": "other",
                            "unitOfMeasure": "",
                            "leadTime": "qwe",
                            "customFields": {},
                            "components": []
                        },
                        "after": {
                            "_id": "67cdf5944c27d038a5a31c92",
                            "partNumber": "00000123",
                            "description": "Огнетушитель на входе",
                            "supplier": "",
                            "supplierId": null,
                            "supplierItemNumber": "",
                            "parentID": [],
                            "countryOfOrigin": "",
                            "status": "pending approval",
                            "regulatoryCompliance": [],
                            "BOMcomponent": "",
                            "storagePath": "",
                            "notes": "",
                            "category": "other",
                            "unitOfMeasure": "",
                            "leadTime": "qwe",
                            "customFields": {},
                            "components": []
                        },
                        "diff": {
                            "description": {
                                "before": "на входе",
                                "after": "Огнетушитель на входе"
                            }
                        }
                    },
                    "timestamp": "2025-03-09T20:10:27.094Z",
                    "createdAt": "2025-03-09T20:10:27.094Z",
                    "updatedAt": "2025-03-09T20:10:27.094Z"
                },
                {
                    "_id": "679bb8faf8f9cb1164e8cb4f",
                    "user": {
                        "_id": "678a6b856d5999ee4ff3befb",
                        "email": "andriy.hardy@gmail.com",
                        "name": "Andriy",
                        "role": "Admin"
                    },
                    "action": "update",
                    "entityType": "Material",
                    "entityId": "6798fd0df16e00582adece12",
                    "changes": {
                        "before": {
                            "_id": "6798fd0df16e00582adece12",
                            "partNumber": "testPartNumber3",
                            "description": "vial amber 8oz",
                            "supplier": "testSupplier4",
                            "supplierId": "6798fa0bf16e00582adecd6e",
                            "supplierItemNumber": "",
                            "parentID": [],
                            "countryOfOrigin": "Mexico",
                            "status": "pending approval",
                            "regulatoryCompliance": [
                                {
                                    "_id": "66eaf23890623cac7248243a",
                                    "title": "California Proposition 65",
                                    "description": "Thee Safe Drinking Water and Toxic Enforcement Act of 1986",
                                    "status": "does_not_comply"
                                },
                                {
                                    "_id": "670fed898818777806d4dee5",
                                    "title": "PFAS",
                                    "description": "Per- and polyfluoroalkyl substances (PFAS) are a group of synthetic chemicals that are resistant to heat, grease, water, and oil. They are also known as forever chemicals because they do not break down in the environment.",
                                    "status": "comply"
                                },
                                {
                                    "_id": "6798fb6cf16e00582adecdc5",
                                    "title": "PBT TSCA",
                                    "description": "Statement from the supplier ",
                                    "status": "comply"
                                },
                                {
                                    "_id": "6798fcd7f16e00582adecdf5",
                                    "title": "EU POP",
                                    "description": "Statement from the supplier ",
                                    "status": "comply"
                                }
                            ],
                            "BOMcomponent": "",
                            "storagePath": "",
                            "notes": "",
                            "category": "",
                            "unitOfMeasure": "",
                            "leadTime": "",
                            "customFields": {},
                            "components": []
                        },
                        "after": {
                            "_id": "6798fd0df16e00582adece12",
                            "partNumber": "testPartNumber3",
                            "description": "vial amber 8088",
                            "supplier": "testSupplier4",
                            "supplierId": "6798fa0bf16e00582adecd6e",
                            "supplierItemNumber": "",
                            "parentID": [],
                            "countryOfOrigin": "Mexico",
                            "status": "pending approval",
                            "regulatoryCompliance": [
                                {
                                    "_id": "66eaf23890623cac7248243a",
                                    "title": "California Proposition 65",
                                    "description": "Thee Safe Drinking Water and Toxic Enforcement Act of 1986",
                                    "status": "does_not_comply"
                                },
                                {
                                    "_id": "670fed898818777806d4dee5",
                                    "title": "PFAS",
                                    "description": "Per- and polyfluoroalkyl substances (PFAS) are a group of synthetic chemicals that are resistant to heat, grease, water, and oil. They are also known as forever chemicals because they do not break down in the environment.",
                                    "status": "comply"
                                },
                                {
                                    "_id": "6798fb6cf16e00582adecdc5",
                                    "title": "PBT TSCA",
                                    "description": "Statement from the supplier ",
                                    "status": "comply"
                                },
                                {
                                    "_id": "6798fcd7f16e00582adecdf5",
                                    "title": "EU POP",
                                    "description": "Statement from the supplier ",
                                    "status": "comply"
                                }
                            ],
                            "BOMcomponent": "",
                            "storagePath": "",
                            "notes": "",
                            "category": "other",
                            "unitOfMeasure": "",
                            "leadTime": "",
                            "customFields": {},
                            "components": []
                        },
                        "diff": {
                            "description": {
                                "before": "vial amber 8oz",
                                "after": "vial amber 8088"
                            },
                            "category": {
                                "before": "",
                                "after": "other"
                            }
                        }
                    },
                    "timestamp": "2025-01-30T17:38:02.605Z",
                    "createdAt": "2025-01-30T17:38:02.606Z",
                    "updatedAt": "2025-01-30T17:38:02.606Z"
                },
                {
                    "_id": "679bb8eef8f9cb1164e8cb36",
                    "user": {
                        "_id": "678a6b856d5999ee4ff3befb",
                        "email": "andriy.hardy@gmail.com",
                        "name": "Andriy",
                        "role": "Admin"
                    },
                    "action": "update",
                    "entityType": "Material",
                    "entityId": "6798fe95f16e00582adece5b",
                    "changes": {
                        "before": {
                            "_id": "6798fe95f16e00582adece5b",
                            "partNumber": "testPartNumber5",
                            "description": "vial 16oz amber",
                            "supplier": "testSupplier3",
                            "supplierId": "6798f9e2f16e00582adecd68",
                            "supplierItemNumber": "",
                            "parentID": [
                                "6798fecbf16e00582adece64"
                            ],
                            "countryOfOrigin": "China",
                            "status": "active",
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
                                    "status": "comply"
                                }
                            ],
                            "BOMcomponent": "",
                            "storagePath": "",
                            "notes": "",
                            "category": "component",
                            "unitOfMeasure": "",
                            "leadTime": "7",
                            "customFields": {},
                            "components": []
                        },
                        "after": {
                            "_id": "6798fe95f16e00582adece5b",
                            "partNumber": "testPartNumber5",
                            "description": "vial 16oz ambererrr",
                            "supplier": "testSupplier3",
                            "supplierId": "6798f9e2f16e00582adecd68",
                            "supplierItemNumber": "",
                            "parentID": [
                                "6798fecbf16e00582adece64"
                            ],
                            "countryOfOrigin": "China",
                            "status": "active",
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
                                    "status": "comply"
                                }
                            ],
                            "BOMcomponent": "",
                            "storagePath": "",
                            "notes": "",
                            "category": "other",
                            "unitOfMeasure": "",
                            "leadTime": "7",
                            "customFields": {},
                            "components": []
                        },
                        "diff": {
                            "description": {
                                "before": "vial 16oz amber",
                                "after": "vial 16oz ambererrr"
                            },
                            "category": {
                                "before": "component",
                                "after": "other"
                            }
                        }
                    },
                    "timestamp": "2025-01-30T17:37:50.589Z",
                    "createdAt": "2025-01-30T17:37:50.590Z",
                    "updatedAt": "2025-01-30T17:37:50.590Z"
                },
                {
                    "_id": "679bb8e4f8f9cb1164e8cb1d",
                    "user": {
                        "_id": "678a6b856d5999ee4ff3befb",
                        "email": "andriy.hardy@gmail.com",
                        "name": "Andriy",
                        "role": "Admin"
                    },
                    "action": "update",
                    "entityType": "Material",
                    "entityId": "679a6bb95546099bec62fc22",
                    "changes": {
                        "before": {
                            "_id": "679a6bb95546099bec62fc22",
                            "partNumber": "testPartNumber111",
                            "description": "Bottle 12 oz",
                            "supplier": "",
                            "supplierId": null,
                            "supplierItemNumber": "JW21121as",
                            "parentID": [],
                            "countryOfOrigin": "Mexico",
                            "status": "pending approval",
                            "regulatoryCompliance": [],
                            "BOMcomponent": "",
                            "storagePath": "",
                            "notes": "asasasasas",
                            "category": "other",
                            "unitOfMeasure": "",
                            "leadTime": "",
                            "customFields": {},
                            "components": []
                        },
                        "after": {
                            "_id": "679a6bb95546099bec62fc22",
                            "partNumber": "testPartNumber111",
                            "description": "Bottle 12 oz3",
                            "supplier": "",
                            "supplierId": null,
                            "supplierItemNumber": "JW21121as",
                            "parentID": [],
                            "countryOfOrigin": "Mexico",
                            "status": "pending approval",
                            "regulatoryCompliance": [],
                            "BOMcomponent": "",
                            "storagePath": "",
                            "notes": "asasasasas",
                            "category": "other",
                            "unitOfMeasure": "",
                            "leadTime": "",
                            "customFields": {},
                            "components": []
                        },
                        "diff": {
                            "description": {
                                "before": "Bottle 12 oz",
                                "after": "Bottle 12 oz3"
                            }
                        }
                    },
                    "timestamp": "2025-01-30T17:37:40.334Z",
                    "createdAt": "2025-01-30T17:37:40.334Z",
                    "updatedAt": "2025-01-30T17:37:40.334Z"
                },
                {
                    "_id": "679bb8d5f8f9cb1164e8cb06",
                    "user": {
                        "_id": "678a6b856d5999ee4ff3befb",
                        "email": "andriy.hardy@gmail.com",
                        "name": "Andriy",
                        "role": "Admin"
                    },
                    "action": "update",
                    "entityType": "Material",
                    "entityId": "6798fa6af16e00582adecd8b",
                    "changes": {
                        "before": {
                            "_id": "6798fa6af16e00582adecd8b",
                            "partNumber": "testPartNumber1",
                            "description": "cap blue 111",
                            "supplier": "testSupplier2",
                            "supplierId": "6798f9b0f16e00582adecd62",
                            "supplierItemNumber": "HJ9921",
                            "parentID": [
                                "67990b36cd8be0cb8882bd60"
                            ],
                            "countryOfOrigin": "Great Britain",
                            "status": "active",
                            "regulatoryCompliance": [
                                {
                                    "_id": "6798fb6cf16e00582adecdc5",
                                    "title": "PBT TSCA",
                                    "description": "Statement from the supplier ",
                                    "status": "comply"
                                }
                            ],
                            "BOMcomponent": "",
                            "storagePath": "",
                            "notes": "New material. Do not sell ",
                            "category": "other",
                            "unitOfMeasure": "",
                            "leadTime": "3",
                            "customFields": {},
                            "components": []
                        },
                        "after": {
                            "_id": "6798fa6af16e00582adecd8b",
                            "partNumber": "testPartNumber1",
                            "description": "cap blue 1100",
                            "supplier": "testSupplier2",
                            "supplierId": "6798f9b0f16e00582adecd62",
                            "supplierItemNumber": "HJ9921",
                            "parentID": [
                                "67990b36cd8be0cb8882bd60"
                            ],
                            "countryOfOrigin": "Great Britain",
                            "status": "active",
                            "regulatoryCompliance": [
                                {
                                    "_id": "6798fb6cf16e00582adecdc5",
                                    "title": "PBT TSCA",
                                    "description": "Statement from the supplier ",
                                    "status": "comply"
                                }
                            ],
                            "BOMcomponent": "",
                            "storagePath": "",
                            "notes": "New material. Do not sell ",
                            "category": "other",
                            "unitOfMeasure": "",
                            "leadTime": "3",
                            "customFields": {},
                            "components": []
                        },
                        "diff": {
                            "description": {
                                "before": "cap blue 111",
                                "after": "cap blue 1100"
                            }
                        }
                    },
                    "timestamp": "2025-01-30T17:37:25.450Z",
                    "createdAt": "2025-01-30T17:37:25.451Z",
                    "updatedAt": "2025-01-30T17:37:25.451Z"
                },
                {
                    "_id": "679bb887f8f9cb1164e8cade",
                    "user": {
                        "_id": "678a6b856d5999ee4ff3befb",
                        "email": "andriy.hardy@gmail.com",
                        "name": "Andriy",
                        "role": "Admin"
                    },
                    "action": "update",
                    "entityType": "Material",
                    "entityId": "6798fa6af16e00582adecd8b",
                    "changes": {
                        "before": {
                            "_id": "6798fa6af16e00582adecd8b",
                            "partNumber": "testPartNumber1",
                            "description": "cap blue ",
                            "supplier": "testSupplier2",
                            "supplierId": "6798f9b0f16e00582adecd62",
                            "supplierItemNumber": "HJ9921",
                            "parentID": [
                                "67990b36cd8be0cb8882bd60"
                            ],
                            "countryOfOrigin": "Great Britain",
                            "status": "active",
                            "regulatoryCompliance": [
                                {
                                    "_id": "6798fb6cf16e00582adecdc5",
                                    "title": "PBT TSCA",
                                    "description": "Statement from the supplier ",
                                    "status": "comply"
                                }
                            ],
                            "BOMcomponent": "",
                            "storagePath": "",
                            "notes": "New material. Do not sell ",
                            "category": "other",
                            "unitOfMeasure": "",
                            "leadTime": "3",
                            "customFields": {},
                            "components": []
                        },
                        "after": {
                            "_id": "6798fa6af16e00582adecd8b",
                            "partNumber": "testPartNumber1",
                            "description": "cap blue 111",
                            "supplier": "testSupplier2",
                            "supplierId": "6798f9b0f16e00582adecd62",
                            "supplierItemNumber": "HJ9921",
                            "parentID": [
                                "67990b36cd8be0cb8882bd60"
                            ],
                            "countryOfOrigin": "Great Britain",
                            "status": "active",
                            "regulatoryCompliance": [
                                {
                                    "_id": "6798fb6cf16e00582adecdc5",
                                    "title": "PBT TSCA",
                                    "description": "Statement from the supplier ",
                                    "status": "comply"
                                }
                            ],
                            "BOMcomponent": "",
                            "storagePath": "",
                            "notes": "New material. Do not sell ",
                            "category": "other",
                            "unitOfMeasure": "",
                            "leadTime": "3",
                            "customFields": {},
                            "components": []
                        },
                        "diff": {
                            "description": {
                                "before": "cap blue ",
                                "after": "cap blue 111"
                            }
                        }
                    },
                    "timestamp": "2025-01-30T17:36:07.227Z",
                    "createdAt": "2025-01-30T17:36:07.228Z",
                    "updatedAt": "2025-01-30T17:36:07.228Z"
                },
                {
                    "_id": "679bb64af8f9cb1164e8ca9c",
                    "user": {
                        "_id": "678a6b856d5999ee4ff3befb",
                        "email": "andriy.hardy@gmail.com",
                        "name": "Andriy",
                        "role": "Admin"
                    },
                    "action": "update",
                    "entityType": "Material",
                    "entityId": "6798fe43f16e00582adece47",
                    "changes": {
                        "before": {
                            "_id": "6798fe43f16e00582adece47",
                            "partNumber": "testPartNumber4",
                            "description": "stopper red PTFE",
                            "supplier": "testSupplier",
                            "supplierId": "679120ca1ddc757a32ba8362",
                            "supplierItemNumber": "",
                            "parentID": [
                                "6798fecbf16e00582adece64"
                            ],
                            "countryOfOrigin": "",
                            "status": "active",
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
                                    "status": "comply"
                                }
                            ],
                            "BOMcomponent": "",
                            "storagePath": "",
                            "notes": "We sell exclusively in bulk quantities, starting from a minimum order of 100,000 units.",
                            "category": "component",
                            "unitOfMeasure": "",
                            "leadTime": "10",
                            "customFields": {},
                            "components": []
                        },
                        "after": {
                            "_id": "6798fe43f16e00582adece47",
                            "partNumber": "testPartNumber404",
                            "description": "stopper red PTFE",
                            "supplier": "testSupplier",
                            "supplierId": "679120ca1ddc757a32ba8362",
                            "supplierItemNumber": "",
                            "parentID": [
                                "6798fecbf16e00582adece64"
                            ],
                            "countryOfOrigin": "",
                            "status": "active",
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
                                    "status": "comply"
                                }
                            ],
                            "BOMcomponent": "",
                            "storagePath": "",
                            "notes": "We sell exclusively in bulk quantities, starting from a minimum order of 100,000 units.",
                            "category": "other",
                            "unitOfMeasure": "",
                            "leadTime": "10",
                            "customFields": {},
                            "components": []
                        },
                        "diff": {
                            "partNumber": {
                                "before": "testPartNumber4",
                                "after": "testPartNumber404"
                            },
                            "category": {
                                "before": "component",
                                "after": "other"
                            }
                        }
                    },
                    "timestamp": "2025-01-30T17:26:34.655Z",
                    "createdAt": "2025-01-30T17:26:34.656Z",
                    "updatedAt": "2025-01-30T17:26:34.656Z"
                },
                {
                    "_id": "65f3e12df4b3c1c5a5d324fc",
                    "action": "DELETE",
                    "entityType": "Supplier",
                    "entityId": "66d0764dd8bdd28e5e126fd6",
                    "timestamp": "2025-03-25T14:20:00.000Z",
                    "user": {
                        "_id": "678a6b856d5999ee4ff3basd",
                        "name": "Jane Smith",
                        "email": "jane@example.com",
                        "role": "moderator"
                    }
                }
            ],
        }
    };
    mockDataLog:LogResponse = {
        status: "success",
        code: 200,
        data: {
            log: {
                _id: "65f3e12df4b3c1c5a5d324fc",
                action: "DELETE",
                entityType: "Supplier",
                entityId: "66d0764dd8bdd28e5e126fd6",
                timestamp: "2025-03-25T14:20:00.000Z",
                user: {
                    _id: "64fbd6...",
                    name: "Jane Smith",
                    email: "jane@example.com",
                    role: "Moderator"
                }
            }
        }
    }
    mockDataLog1:LogResponse = {
        status: "success",
        code: 200,
        data: {
            log: {
                "_id": "679bb64af8f9cb1164e8ca9c",
                "user": {
                    "_id": "678a6b856d5999ee4ff3befb",
                    "email": "andriy.hardy@gmail.com",
                    "name": "Andriy",
                    "role": "Admin"
                },
                "action": "update",
                "entityType": "Material",
                "entityId": "6798fe43f16e00582adece47",
                "changes": {
                    "before": {
                        "_id": "6798fe43f16e00582adece47",
                        "partNumber": "testPartNumber4",
                        "description": "stopper red PTFE",
                        "supplier": "testSupplier",
                        "supplierId": "679120ca1ddc757a32ba8362",
                        "supplierItemNumber": "",
                        "parentID": [
                            "6798fecbf16e00582adece64"
                        ],
                        "countryOfOrigin": "",
                        "status": "active",
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
                                "status": "comply"
                            }
                        ],
                        "BOMcomponent": "",
                        "storagePath": "",
                        "notes": "We sell exclusively in bulk quantities, starting from a minimum order of 100,000 units.",
                        "category": "component",
                        "unitOfMeasure": "",
                        "leadTime": "10",
                        "customFields": {},
                        "components": []
                    },
                    "after": {
                        "_id": "6798fe43f16e00582adece47",
                        "partNumber": "testPartNumber404",
                        "description": "stopper red PTFE",
                        "supplier": "testSupplier",
                        "supplierId": "679120ca1ddc757a32ba8362",
                        "supplierItemNumber": "",
                        "parentID": [
                            "6798fecbf16e00582adece64"
                        ],
                        "countryOfOrigin": "",
                        "status": "active",
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
                                "status": "comply"
                            }
                        ],
                        "BOMcomponent": "",
                        "storagePath": "",
                        "notes": "We sell exclusively in bulk quantities, starting from a minimum order of 100,000 units.",
                        "category": "other",
                        "unitOfMeasure": "",
                        "leadTime": "10",
                        "customFields": {},
                        "components": []
                    },
                    "diff": {
                        "partNumber": {
                            "before": "testPartNumber4",
                            "after": "testPartNumber404"
                        },
                        "category": {
                            "before": "component",
                            "after": "other"
                        }
                    }
                },
                "timestamp": "2025-01-30T17:26:34.655Z",
                "createdAt": "2025-01-30T17:26:34.656Z",
                "updatedAt": "2025-01-30T17:26:34.656Z"
            }
        }
    }

    private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  // getAll(tableQueryParams: { [key: string]: any }){
  //   let params = new HttpParams();
  //   if (tableQueryParams) {
  //     for (const key in tableQueryParams) {
  //       if (tableQueryParams.hasOwnProperty(key) && tableQueryParams[key] !== undefined && tableQueryParams[key] !== null) {
  //         params = params.set(key, tableQueryParams[key]);
  //       }
  //     }
  //   }
  //
  //   return this.http.get<LogsResponse>(`${this.apiUrl}/roles/`, { params }).pipe(
  //       catchError((error) => {
  //         this.toastr.error(error.error.message)
  //         // Return an empty array or fallback data in case of error
  //         const emptyRolesObj = {
  //           data: {
  //             totalPages: 0,
  //             roles: [],
  //           }
  //         };
  //         return of(emptyRolesObj);
  //       })
  //   );
  // }

    getAll(tableQueryParams: { [key: string]: any }){
      let logsResponse: any = {...this.mockData};
        logsResponse.data.logs = logsResponse.data.logs.map((item:Log)=> {
          let newLog: LogTableItem = {
              action: item.action,
              entityType: item.entityType,
              changes: item.changes?.diff ? Object.keys(item.changes.diff).join(', '): '',
              userId: item.user._id,
              userEmail: item.user.email,
              userName: item.user.name,
              userRole: item.user.role,
              timestamp: new Date(item.timestamp).toLocaleString('uk-UA', { // todo: Залежно від аккаунту current user змінювати locale 'uk-UA'
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
              }),
          }
          return newLog;
      });
      console.log(logsResponse);
      return of(logsResponse);
    }
  //
  // get(id: string) {
  //   return this.http.get<LogResponse>(`${this.apiUrl}/roles/${id}`).pipe(
  //       catchError((error) => {
  //         this.toastr.error(error.error.message)
  //         return of({data: []});
  //       })
  //   );
  // }

    get(id: string){
        return of(this.mockDataLog1);
    }

  // delete():Observable<any> {
  //   return this.http.delete<LogResponse>(`${this.apiUrl}/logs/cleanup`).pipe(
  //       tap((res: any) => {
  //         if (res.code === 200){
  //           this.toastr.success('Logs have been successfully deleted');
  //         }
  //       }),
  //       catchError((error) => {
  //         this.toastr.error(error.error.message)
  //         return of({data: []});
  //       })
  //   );
  // }
}