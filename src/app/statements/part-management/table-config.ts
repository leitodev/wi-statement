
// textCenter componentsTemplate rcList
const tableConfig = {
  tableName: 'part-management',
  cells: [
    {
      name: 'id',
      sort: false,
      value: '_id',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Supplier',
      sort: true,
      value: 'supplier',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Part Number',
      sort: true,
      value: 'partNumber',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Components',
      sort: false,
      value: 'components',
      type: 'componentsTemplate',
      visible: true,
    },
    {
      name: 'Description',
      sort: true,
      value: 'description',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'RCompliance',
      sort: true,
      value: 'regulatoryCompliance',
      type: 'rcList',
      visible: false,
    },
    {
      name: 'Country Of Origin',
      sort: true,
      value: 'countryOfOrigin',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Status',
      sort: true,
      value: 'status',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Supplier Item Number',
      sort: true,
      value: 'supplierItemNumber',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Category',
      sort: true,
      value: 'category',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'BOMcomponent',
      sort: true,
      value: 'BOMcomponent',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Unit Of Measure',
      sort: true,
      value: 'unitOfMeasure',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Notes',
      sort: true,
      value: 'notes',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Lead Time',
      sort: true,
      value: 'leadTime',
      type: 'textCenter',
      visible: true,
    },
  ],
  paginator: {
    currentPage: 1,
    totalPages: 1,
  },
  limit: 15
}
export default tableConfig;