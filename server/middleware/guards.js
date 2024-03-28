function isAuth(req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
    }
}

function onlyForGuest(req, res, next) {
    if (req.user) {
        return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
    } else {
        next();
    }
}

function isOwner(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });

    } else if (res.locals.preload?.role == 'user') {
        if (req.user._id == res.locals.preload._id) {
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden', statusCode: 403 });
        }

    } else if (req.user._id == res.locals.preload?.owner?._id) {
        next();

    } else if (req.user._id == res.locals.preload?.storeId?.owner) {
        next();

    } else if (req.user._id == res.locals.preload?.userId?._id) {
        next();

    } else {
        return res.status(403).json({ message: 'Forbidden', statusCode: 403 });
    }
}

function isNotOwner(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });

    } else if (req.user._id != res.locals.preload?.owner._id) {
        next();

    } else {
        return res.status(403).json({ message: 'The owner cannot perform this action', statusCode: 403 });
    }
}

function isRoleAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });

    } else if (req.user.role === 'admin') {
        next();

    } else {
        return res.status(403).json({ message: 'Forbidden', statusCode: 403 });
    }
}

function isAllowedTimeToChangeOrders(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });

    } else if (res.locals.preload?.date) {
        const timestampCreated = res.locals.preload?.date; 
        const timestampNow = new Date().getTime(); 

        const timeDifferenceInMilliseconds = Math.abs(timestampCreated - timestampNow); 
        const allowedTimeIntervalInMilliseconds = 5 * 60 * 1000;

        if (timeDifferenceInMilliseconds <= allowedTimeIntervalInMilliseconds) {
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden - Time is more than five minutes', statusCode: 403 });
        }
    } else {
        return res.status(403).json({ message: 'Forbidden', statusCode: 403 });
    }
}

module.exports = {
    isAuth,
    onlyForGuest,
    isOwner,
    isNotOwner,
    isRoleAdmin,
    isAllowedTimeToChangeOrders,
};
