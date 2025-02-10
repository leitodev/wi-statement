const tableConfig = {
    tableName: 'suppliers',
    cells: [
        {
            name: 'id',
            sort: false,
            value: '_id',
            type: 'textCenter',
            visible: true,
        },
        {
            name: 'Name',
            sort: true,
            value: 'name',
            type: 'redirectTo',
            visible: true,
        },
        {
            name: 'Country of origin',
            sort: true,
            value: 'countryOfOrigin',
            type: 'textCenter',
            visible: true,
        },
        {
            name: 'Notes',
            sort: false,
            value: 'notes',
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
            name: 'Created At',
            sort: true,
            value: 'createdAt',
            type: 'shortDate',
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