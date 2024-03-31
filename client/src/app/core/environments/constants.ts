export const constants = {
    hostBackEnd: 'http://localhost:3000/',
    userTokenName: '65c227bd8f4eb7fe5ee3cd2ad13a5a8c',
    defaultPaginationPageNum: '1',
    defaultPaginationLimitNum: '3',
};

export const endpoints = {
    getAllStores: (page: string, limit: string) => `stores?page=${page}&limit=${limit}`,
    getStoresBySearch: (storeName: string) => `stores/search?name=${storeName}`, 
};
