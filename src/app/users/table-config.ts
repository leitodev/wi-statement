
// textCenter componentsTemplate rcList
const tableConfig = {
  tableName: 'users',
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
      name: 'Surname',
      sort: true,
      value: 'surname',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Email',
      sort: true,
      value: 'email',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Email Verified',
      sort: false,
      value: 'emailVerified',
      type: 'textCenter',
      visible: false,
    },
    {
      name: 'Role',
      sort: true,
      value: 'role',
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
      name: 'Locale',
      sort: true,
      value: 'locale',
      type: 'textCenter',
      visible: true,
    },
    {
      name: 'Timezone',
      sort: false,
      value: 'timezone',
      type: 'textCenter',
      visible: false,
    },
    {
      name: 'Avatar URL',
      sort: false,
      value: 'profile',
      type: 'userProfile',
      visible: false,
    },
    {
      name: 'Last login at',
      sort: true,
      value: 'lastLoginAt',
      type: 'shortDate',
      visible: false,
    },
    {
      name: 'Password',
      sort: false,
      value: 'password',
      type: 'textCenter',
      visible: false,
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