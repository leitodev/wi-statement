
// textCenter componentsTemplate rcList
const tableConfig = {
  tableName: 'part-management',
  cells: [
    {
      name: 'id',
      sort: true,
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
      sort: false,
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
      sort: false,
      value: 'description',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'RCompliance',
      sort: false,
      value: 'regulatoryCompliance',
      type: 'rcList',
      visible: false,
    },
  ],
  paginator: {
    currentPage: 1,
    totalPages: 1,
  },
  limit: 20
}
export default tableConfig;