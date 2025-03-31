
// textCenter componentsTemplate rcList
const tableConfig = {
  tableName: 'roles',
  cells: [
    {
      name: 'ID',
      sort: false,
      value: '_id',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Name',
      sort: true,
      value: 'name',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Description',
      sort: false,
      value: 'description',
      type: 'textCenter',
      visible: true,
    }
  ],
  paginator: {
    currentPage: 1,
    totalPages: 1,
  },
  limit: 10
}
export default tableConfig;