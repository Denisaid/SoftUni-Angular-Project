export const constants = {
    hostBackEnd: 'http://localhost:3000/',
    userTokenName: '65c227bd8f4eb7fe5ee3cd2ad13a5a8c',
    defaultPaginationPageNum: '1',
    defaultPaginationLimitNum: '3',
};

export const endpoints = {
    register: 'users/register',
    login: 'users/login',
    logout: 'users/logout',
    getUserById: (userId: string) => `users/${userId}`, 
    getAllStores: (page: string, limit: string) => `stores?page=${page}&limit=${limit}`,
    getStoresBySearch: (storeName: string) => `stores/search?name=${storeName}`, 
};

export const translateErrorsFromServer: Map<string, string> = new Map([
    ['Email is already used!', 'The email is already taken, please use another'],
    ['Invalid username or password!', 'Invalid user or password'],
    ['Invalid email', 'The email entered is invalid'],
    ['Forbidden - Time is more than five minutes', 'The order cannot be edited. More than 5 minutes have passed. For additional information please call.']
]);