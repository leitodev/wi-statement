
// textCenter componentsTemplate rcList
const tableConfig = {
  tableName: 'part-management',
  cells: [
    {
      name: 'id',
      sort: false,
      value: '_id',
      type: 'textCenter',
      visible: false,
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
      visible: false,
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
      visible: false,
    },
    {
      name: 'Status',
      sort: true,
      value: 'status',
      type: 'textCenter',
      visible: false,
    },
    {
      name: 'Supplier Item Number',
      sort: true,
      value: 'supplierItemNumber',
      type: 'textCenter',
      visible: false,
    },
    {
      name: 'Category',
      sort: true,
      value: 'category',
      type: 'textCenter',
      visible: false,
    },
    {
      name: 'BOMcomponent',
      sort: true,
      value: 'BOMcomponent',
      type: 'textCenter',
      visible: false,
    },
    {
      name: 'Unit Of Measure',
      sort: true,
      value: 'unitOfMeasure',
      type: 'textCenter',
      visible: false,
    },
    {
      name: 'Notes',
      sort: true,
      value: 'notes',
      type: 'textCenter',
      visible: false,
    },
    {
      name: 'Lead Time',
      sort: true,
      value: 'leadTime',
      type: 'textCenter',
      visible: false,
    },
    {
      name: 'Created At',
      sort: true,
      value: 'createdAt',
      type: 'shortDate',
      visible: false,
    },
    {
      name: 'Updated At',
      sort: true,
      value: 'updatedAt',
      type: 'shortDate',
      visible: false,
    },

  ],
  paginator: {
    currentPage: 1,
    totalPages: 1,
  },
  limit: 15
}
export default tableConfig;