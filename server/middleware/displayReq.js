module.exports = () => (req, res, next) => {
    console.log(`Request to: ${req.path} with method: ${req.method}`)
    const isEmpty = Object.keys(req.body).length === 0;
    
    if (isEmpty === false) {
        console.log(req.body);
    }

    next();
}