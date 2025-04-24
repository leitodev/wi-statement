const tableConfig = {
  tableName: 'logsTable',
  cells: [
    {
      name: 'Action',
      sort: false,
      value: 'action',
      type: 'colored',
      visible: true,
    },
    {
      name: 'Entity type',
      sort: false,
      value: 'entityType',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Modified fields',
      sort: false,
      value: 'changes',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'User Id',
      sort: false,
      value: 'userId',
      type: 'textCenter',
      visible: false,
    },
    {
      name: 'User email',
      sort: false,
      value: 'userEmail',
      type: 'textCenter',
      visible: false,
    },
    {
      name: 'User name',
      sort: false,
      value: 'userName',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'User role',
      sort: false,
      value: 'userRole',
      type: 'textCenter',
      visible: false,
    },
    {
      name: 'Time',
      sort: false,
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