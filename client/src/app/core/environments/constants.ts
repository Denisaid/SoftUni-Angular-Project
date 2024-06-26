export const constants = {
    hostBackEnd: 'https://softuni-angular-project-server.onrender.com/',
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
    getStoreById: (storeId: string) => `stores/${storeId}`,
    addNewStore: 'stores',
    updateStore: (storeId: string) => `stores/${storeId}`,
    deleteStore: (storeId: string) => `stores/${storeId}`,
    getAllProductsStore: (storeId: string) => `stores/products/${storeId}`,
    getProductById: (productId: string) => `stores/products/product/${productId}`,
    addNewProduct: (storeId: string) => `stores/products/${storeId}`,
    updateProduct: (productId: string) => `stores/products/edit/${productId}`,
    deleteProduct: (productId: string) => `stores/products/delete/${productId}`,   
    getCommentById: (commentId: string) => `stores/comments/comment/${commentId}`,
    getAllCommentsStore: (storeId: string) => `stores/comments/${storeId}`,
    addNewComment: (storeId: string) => `stores/comments/${storeId}`,
    updateComment: (commentId: string) => `stores/comments/edit/${commentId}`,
    deleteComment: (commentId: string) => `stores/comments/delete/${commentId}`,
    getUserStores: (userId: string) => `stores/my-stores/${userId}`,
    getOrderById: (orderId: string) => `stores/orders/order/${orderId}`,
    getStoreOrders: (storeId: string) => `stores/orders/${storeId}`,     
    getUserBought: (userId: string) => `stores/orders/user-orders/${userId}`,     
    buyFromStore: (storeId: string) => `stores/orders/buys/${storeId}`,
    updateOrder: (orderId: string) => `stores/orders/edit/${orderId}`,
    deleteOrder: (orderId: string) => `stores/orders/delete/${orderId}`,
};

export const translateErrorsFromServer: Map<string, string> = new Map([
    ['Email is already used!', 'The email is already taken, please use another'],
    ['Invalid username or password!', 'Invalid user or password'],
    ['Invalid email', 'The email entered is invalid'],
    ['Forbidden - Time is more than five minutes', 'The order cannot be edited. More than 5 minutes have passed. For additional information please call.']
]);