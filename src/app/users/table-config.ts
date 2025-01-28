
// textCenter componentsTemplate rcList
const tableConfig = {
  tableName: 'users',
  cells: [
    {
      name: 'id',
      sort: false,
      value: '_id',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Role',
      sort: false,
      value: 'role',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Name',
      sort: false,
      value: 'name',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Surname',
      sort: false,
      value: 'surname',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Email',
      sort: false,
      value: 'email',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Email Verified',
      sort: false,
      value: 'emailVerified',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'password',
      sort: false,
      value: 'password',
      type: 'textCenter',
      visible: false,
    },
    {
      name: 'Locale',
      sort: false,
      value: 'locale',
      type: 'textCenter',
      visible: false,
    },
    {
      name: 'Timezone',
      sort: false,
      value: 'timezone',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Avatar URL',
      sort: false,
      value: 'profile',
      type: 'userProfile',
      visible: false,
    },
    {
      name: 'Status',
      sort: false,
      value: 'status',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Last login at',
      sort: false,
      value: 'lastLoginAt',
      type: 'shortDate',
      visible: true,
    },
    {
      name: 'Token',
      sort: false,
      value: 'token',
      type: 'textCenter',
      visible: false,
    },
  ],
  paginator: {
    currentPage: 1,
    totalPages: 1,
  },
  limit: 10
}
export default tableConfig;