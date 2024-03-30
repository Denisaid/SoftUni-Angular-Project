const { Comment } = require("../models/Comment");
const { Order } = require("../models/Order");
const { Product } = require("../models/Product");
const { Store } = require("../models/Store");

const addNewStore = (storeData, userId) => {
    const { name, category, description, image } = storeData;
    return Store.create({ name, category, description, image, owner: userId });
};

const updateStore = (storeData, storeId) => {
    const { name, category, description, image } = storeData;
    return Store.findByIdAndUpdate(storeId, { name, category, description, image }, { runValidators: true, new: true });
};

const deleteStore = async (storeId) => {
    const deletedStore = await Store.findByIdAndDelete(storeId, { returnDocument: true });
    await Product.deleteMany({ storeId: storeId });
    await Comment.deleteMany({ storeId: storeId });
    await Order.deleteMany({ storeId: storeId });
    return deletedStore;
};

const getStoresBySearch = (nameInput = '') => Store.find(
    {
        name: { $regex: new RegExp(nameInput, 'gi') }
    }
);

const getStoreById = (storeId) => Store.findById(storeId).populate('owner', ['name', 'email', 'phone', 'address', 'role']);

const getAllStores = (page, limit) => Store.find().skip((page - 1) * limit).limit(limit);

const getAllCountStores = () => Store.countDocuments();

const getUserStores = (userId) => Store.find({ owner: userId });

const addNewProduct = async (productData, storeId) => {
    const { name, description, price, material, image } = productData;
    return await Product.create({ name, description, price, material, image, storeId: storeId });
};

const updateProduct = (productData, productId) => {
    const { name, description, price, material, image } = productData;
    return Product.findByIdAndUpdate(productId, { name, description, price, material, image }, { runValidators: true, new: true });
};

const deleteProduct = (productId) => Product.findByIdAndDelete(productId, { returnDocument: true });

const getProductById = (productId) => Product.findById(productId).populate('storeId');

const getAllProducts = (storeId) => Product.find({ storeId: storeId });

const addNewComment = (commentData, storeId, userId) => {
    const { comment } = commentData;
    return Comment.create({ comment, storeId, userId });
};

const getCommentById = (commentId) => Comment.findById(commentId).populate('userId', ['name', 'email', 'phone', 'address', 'role']);

const getAllComments = (storeId) => Comment.find({ storeId: storeId }).populate('userId', ['name', 'email', 'phone', 'address', 'role']);

const updateComment = (commentData, commentId) => {
    const { comment } = commentData;
    return Comment.findByIdAndUpdate(commentId, { comment }, { runValidators: true, new: true });
};

const deleteComment = (commentId) => Comment.findByIdAndDelete(commentId, { returnDocument: true });

const buyFromStore = (storeId, userId, boughtProducts) => {
    const { orders, addressDelivery, date } = boughtProducts;
    return Order.create({ storeId, userId, orders, addressDelivery, date })
};

const getStoreOrders = (storeId) => Order.find({ storeId: storeId }).populate('orders');

const getAllUserOrders = (userId) => Order.find({ userId: userId }).populate('orders storeId');

const getUserOrderById = (orderId) => Order.findById(orderId).populate('orders storeId');

const updateUserOrder = (orderData, orderId) => {
    const { addressDelivery, orders } = orderData;
    return Order.findByIdAndUpdate(orderId, { addressDelivery, orders }, { runValidators: true, new: true });
};

const deleteUserOrder = (orderId) => Order.findByIdAndDelete(orderId, { returnDocument: true });

module.exports = {
    addNewStore,
    updateStore,
    deleteStore,
    getStoreById,
    getAllStores,
    getAllCountStores,
    getStoreOrders,
    buyFromStore,
    addNewProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllProducts,
    addNewComment,
    updateComment,
    getAllComments,
    getCommentById,
    deleteComment,
    getStoresBySearch,
    getUserStores,
    getAllUserOrders,
    getUserOrderById,
    updateUserOrder,
    deleteUserOrder,
};