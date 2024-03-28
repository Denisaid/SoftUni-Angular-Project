const userController = require("../controllers/userController");
const displayReq = require("../middleware/displayReq");

module.exports = (app) => {
    app.use(displayReq());
    
    app.use('/users', userController);

    app.all('*', (req, res, next) => {
        try {
            throw new Error(`No content - path ${req.path} of method ${req.method} not found`);
        } catch (error) {
            error.statusCode = 404;
            next(error);
        }
    });
};