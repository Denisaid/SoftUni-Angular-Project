const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isAuth, isOwner, isNotOwner, isRoleAdmin, isAllowedTimeToChangeOrders } = require('../middleware/guards');
const { preload } = require('../middleware/preload');
const { getUserById } = require('../services/userService');
const {
    getAllCountStores,
    getAllStores,
    addNewStore,
    updateStore,
    getStoreById,
    deleteStore,
    getStoreOrders,
    buyFromStore,
    addNewProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllProducts,
    addNewComment,
    getCommentById,
    updateComment,
    deleteComment,
    getAllComments,
    getStoresBySearch,
    getUserStores,
    getAllUserOrders,
    getUserOrderById,
    updateUserOrder,
    deleteUserOrder,
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

router.get('/products/:storeId', async (req, res) => {
    try {

        const storeId = req.params.storeId;
        const allProducts = await getAllProducts(storeId);

        res.status(200).json(allProducts);
    } catch (error) {
        next(error);
    }
});

router.get('/products/product/:productId', isAuth, preload(getProductById, 'productId'), isOwner, isRoleAdmin, async (req, res, next) => {
    try {

        const productId = req.params.productId;
        const product = await getProductById(productId); 

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
});

router.post('/products/:storeId',
    body(['name', 'description', 'price', 'material', 'image']).trim(),
    body('name').isLength({ max: 100 }).withMessage('Product must be a maximum of one hundred characters long'),
    body('description').isLength({ max: 70 }).withMessage('Product must be a maximum of seventy characters long'),
    body('price').isNumeric({ min: 0 }).withMessage('Price must be a positive number'),
    body('material').isLength({ max: 20 }).withMessage('Material must be a maximum of twenty characters long'),
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
            const productData = req.body;

            const newProduct = await addNewProduct(productData, storeId);

            res.status(201).json(newProduct);
        } catch (error) {
            next(error);
        }
    });

router.put('/products/edit/:productId',
    body(['name', 'description', 'price', 'material', 'image']).trim(),
    body('name').isLength({ max: 100 }).withMessage('Product must be a maximum of one hundred characters long'),
    body('description').isLength({ max: 70 }).withMessage('Product must be a maximum of seventy characters long'),
    body('price').isNumeric({ min: 0 }).withMessage('Price must be a positive number'),
    body('material').isLength({ max: 20 }).withMessage('Material must be a maximum of twenty characters long'),
    body('image').matches(/^https?:\/\/[^ ]+$/gi).withMessage('Image URL must start with http:// or https://'),
    isAuth,
    preload(getProductById, 'productId'),
    isOwner,
    isRoleAdmin,
    async (req, res, next) => {
        try {

            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors;
            }

            const productId = req.params.productId;
            const productData = req.body;
            const updatedProduct = await updateProduct(productData, productId);

            res.status(200).json(updatedProduct);
        } catch (error) {
            next(error);
        }
    });

router.delete('/products/delete/:productId', isAuth, preload(getProductById, 'productId'), isOwner, isRoleAdmin, async (req, res, next) => {
    try {

        const productId = req.params.productId;
        const deletedProduct = await deleteProduct(productId);

        res.status(200).json({ message: 'Product is successfully deleted', deletedProduct });
    } catch (error) {
        next(error);
    }
});

router.get('/orders/:storeId', isAuth, preload(getStoreById), isOwner, isRoleAdmin, async (req, res, next) => {
    try {

        const storeId = req.params.storeId;
        const orders = await getStoreOrders(storeId);

        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
});

router.post('/orders/buys/:storeId', isAuth, async (req, res, next) => {
    try {

        const userId = req.user._id;
        const storeId = req.params.storeId;
        const boughtProducts = req.body;
        
        await buyFromStore(storeId, userId, boughtProducts);

        res.status(200).json({ message: 'Successful purchase' });
    } catch (error) {
        next(error);
    }
});

router.get('/orders/user-orders/:userId', isAuth, preload(getUserById, 'userId'), isOwner, async (req, res, next) => {
    try {

        const userId = req.params.userId;
        const myOrders = await getAllUserOrders(userId);

        res.status(200).json(myOrders);
    } catch (error) {
        next(error);
    }
});

router.get('/orders/order/:orderId', isAuth, preload(getUserOrderById, 'orderId'), isOwner, async (req, res, next) => {
    try {

        const orderId = req.params.orderId;
        const myOrder = await getUserOrderById(orderId);

        res.status(200).json(myOrder);
    } catch (error) {
        next(error);
    }
});

router.put('/orders/edit/:orderId', isAuth, preload(getUserOrderById, 'orderId'), isAllowedTimeToChangeOrders, isOwner, async (req, res, next) => {
    try {

        const orderData = req.body;
        const orderId = req.params.orderId;
        const updatedOrder = await updateUserOrder(orderData, orderId);

        res.status(200).json(updatedOrder);
    } catch (error) {
        next(error);
    }
});

router.delete('/orders/delete/:orderId', isAuth, preload(getUserOrderById, 'orderId'), isAllowedTimeToChangeOrders, isOwner, async (req, res, next) => {
    try {

        const orderId = req.params.orderId;
        const deletedOrder = await deleteUserOrder(orderId);

        res.status(200).json({ message: 'Order is successfully deleted', deletedOrder });
    } catch (error) {
        next(error);
    }
});

router.get('/comments/:storeId', async (req, res) => {
    try {

        const storeId = req.params.storeId;
        const allComments = await getAllComments(storeId);

        res.status(200).json(allComments);
    } catch (error) {
        next(error);
    }
});

router.get('/comments/comment/:commentId', isAuth, preload(getCommentById, 'commentId'), isOwner, async (req, res, next) => {
    try {

        const commentId = req.params.commentId;
        const comment = await getCommentById(commentId); // With populated userId

        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
});

router.post('/comments/:storeId',
    body('comment').trim(),
    body('comment')
        .notEmpty().withMessage('Comment is required').bail()
        .isLength({ max: 300 }).withMessage('Comment must be be a maximum of three hundred characters long'),
    isAuth,
    preload(getStoreById),
    isNotOwner,
    async (req, res, next) => {
        try {

            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors;
            }

            const commentData = req.body;
            const storeId = req.params.storeId;
            const userId = req.user._id;
            const newComment = await addNewComment(commentData, storeId, userId);

            res.status(201).json(newComment);
        } catch (error) {
            next(error);
        }
    });

router.put('/comments/edit/:commentId',
    body('comment').trim(),
    body('comment')
        .notEmpty().withMessage('Comment is required').bail()
        .isLength({ max: 300 }).withMessage('Comment must be be a maximum of three hundred characters long'),
    isAuth,
    preload(getCommentById, 'commentId'),
    isOwner,
    async (req, res, next) => {
        try {

            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors;
            }

            const commentData = req.body;
            const commentId = req.params.commentId;
            const updatedComment = await updateComment(commentData, commentId);

            res.status(200).json(updatedComment);
        } catch (error) {
            next(error);
        }
    });

router.delete('/comments/delete/:commentId', isAuth, preload(getCommentById, 'commentId'), isOwner, async (req, res, next) => {
    try {

        const commentId = req.params.commentId;
        const deletedComment = await deleteComment(commentId);

        res.status(200).json({ message: 'Comment is successfully deleted', deletedComment });
    } catch (error) {
        next(error);
    }
});


module.exports = router;