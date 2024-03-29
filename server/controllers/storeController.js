const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isAuth, isOwner, isRoleAdmin } = require('../middleware/guards');
const { preload } = require('../middleware/preload');
const {
    getAllCountStores,
    getAllStores,
    addNewStore,
    updateStore,
    getStoreById,
    deleteStore,
    getStoresBySearch,
    getUserStores,
}
    = require('../services/storeService');

router.get('/', async (req, res, next) => {

    try {
        const page = parseInt(req.query.page) || 1;   
        const limit = parseInt(req.query.limit) || 6; 
        const [countStores, stores] = await Promise.all([
            getAllCountStores(),
            getAllStores(page, limit),
        ]);

        const totalPages = Math.ceil(countStores / limit); 
        const result = { stores, page, totalPages };

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.get('/search', async (req, res, next) => {
    try {
        const { name } = req.query;
        const stores = await getStoresBySearch(name);

        res.status(200).json(stores);
    } catch (error) {
        next(error);
    }
});

router.get('/:storeId', async (req, res, next) => {
    try {

        const storeId = req.params.storeId;
        const store = await getStoreById(storeId); 

        res.status(200).json(store);
    } catch (error) {
        next(error);
    }
});

router.post('/',
    body(['name', 'category', 'description', 'image']).trim(),
    body('name').isLength({ max: 50 }).withMessage('The store name must be a maximum of fifty characters long'),
    body('category').isLength({ max: 50 }).withMessage('Category must be a maximum of fifty characters long'),
    body('description').isLength({ max: 200 }).withMessage('Description must be a maximum of two hundred characters long'),
    body('image').matches(/^https?:\/\/[^ ]+$/gi).withMessage('Image URL must start with http:// or https://'),
    isAuth,
    isRoleAdmin,
    async (req, res, next) => {
        try {

            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors;
            }

            const userId = req.user._id;
            const storeData = req.body;
            const newStore = await addNewStore(storeData, userId);

            res.status(201).json(newStore);
        } catch (error) {
            next(error);
        }
    });


router.put('/:storeId',
    body(['name', 'category', 'image']).trim(),
    body('name').isLength({ max: 50 }).withMessage('The store name must be a maximum of fifty characters long'),
    body('category').isLength({ max: 50 }).withMessage('Category must be a maximum of fifty characters long'),
    body('image').matches(/^https?:\/\/[^ ]+$/gi).withMessage('Image URL must start with http:// or https://'),
    isAuth,
    preload(getStoreById),
    isOwner,
    isRoleAdmin,
    async (req, res, next) => {
        try {

            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors;
            }
            const storeId = req.params.storeId;
            const storeData = req.body;
            const updatedStore = await updateStore(storeData, storeId);

            res.status(200).json(updatedStore);
        } catch (error) {
            next(error);
        }
    });

router.delete('/:storeId', isAuth, preload(getStoreById), isOwner, isRoleAdmin, async (req, res, next) => {
    try {

        const storeId = req.params.storeId;
        const deletedStore = await deleteStore(storeId);

        res.status(200).json({ message: 'Store is successfully deleted', deletedStore });
    } catch (error) {
        next(error);
    }
});

router.get('/my-stores/:userId', isAuth, isRoleAdmin, async (req, res, next) => {
    try {

        const userId = req.params.userId;
        const userStores = await getUserStores(userId);

        res.status(200).json(userStores);
    } catch (error) {
        next(error);
    }
});

module.exports = router;