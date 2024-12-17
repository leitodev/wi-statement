
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
  ],
  paginator: {
    currentPage: 1,
    totalPages: 1,
  },
  limit: 15
}
export default tableConfig;