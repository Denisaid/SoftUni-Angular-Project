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


module.exports = {
    addNewStore,
    updateStore,
    deleteStore,
    getStoreById,
    getAllStores,
    getAllCountStores,
    getStoresBySearch,
    getUserStores,
};