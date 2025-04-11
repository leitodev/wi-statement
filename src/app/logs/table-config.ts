
// textCenter componentsTemplate rcList

const tableConfig = {
  tableName: 'logsTable',
  cells: [
    {
      name: 'Action',
      sort: true,
      value: 'action',
      type: 'colored',
      visible: true,
    },
    {
      name: 'Entity type',
      sort: true,
      value: 'entityType',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Modified fields',
      sort: true,
      value: 'changes',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'User Id',
      sort: true,
      value: 'userId',
      type: 'textCenter',
      visible: false,
    },
    {
      name: 'User email',
      sort: true,
      value: 'userEmail',
      type: 'textCenter',
      visible: false,
    },
    {
      name: 'User name',
      sort: true,
      value: 'userName',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'User role',
      sort: true,
      value: 'userRole',
      type: 'textCenter',
      visible: false,
    },
    {
      name: 'Time',
      sort: true,
      value: 'timestamp',
      type: 'textCenter',
      visible: true,
    }
  ],
  paginator: {
    currentPage: 1,
    totalPages: 1,
  },
  limit: 20
}
export default tableConfig;