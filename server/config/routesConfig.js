const storeController = require("../controllers/storeController");
const userController = require("../controllers/userController");
const securityController = require("../controllers/securityController");
const displayReq = require("../middleware/displayReq");

module.exports = (app) => {
    app.use(displayReq());
    
    app.use('/stores', storeController);
    app.use('/users', userController);

    app.use('/security', securityController);

    app.all('*', (req, res, next) => {
        try {
            throw new Error(`No content - path ${req.path} of method ${req.method} not found`);
        } catch (error) {
            error.statusCode = 404;
            next(error);
        }
    });
};