const { User } = require('../models/User.js');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { tokenBlackList } = require('../util/tokenBlackList.js');

require('dotenv').config();
const roundsBcrypt = Number(process.env.ROUNDS_BCRYPT);
const jwtSecret = process.env.JWT_SECRET;

async function userRegister(userData) {
    const { name, email, phone, address, password, role } = userData;
    const isExisting = await User.findOne({ email });

    if (isExisting) {
        throw new Error('Email is already used!');
    }

    const hashedPassword = await bcrypt.hash(password, roundsBcrypt);

    const user = await User.create({
        name,
        email,
        phone,
        address,
        role,
        password: hashedPassword
    });

    const userToken = await generateToken(user);

    return {
        accessToken: userToken,
        userDetails: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
        }
    };
}

async function userLogin(userData) {
    const { email, password } = userData;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid username or password!');
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
        throw new Error('Invalid username or password!');
    }

    const userToken = await generateToken(user);

    return {
        accessToken: userToken,
        userDetails: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
        }
    };
}

async function generateToken(user) {
    try {
        const token = await new Promise((resolve, reject) => {
            jwt.sign({
                _id: user._id,
                email: user.email,
                name: user.name,
                address: user.address,
                phone: user.phone,
                role: user.role,
            },
                jwtSecret,
                { expiresIn: '1d' }, 
                (err, signedToken) => {
                    if (err) {
                        reject(new Error('The token could not be signed!'));
                    } else {
                        resolve(signedToken);
                    }
                }
            );
        });

        return token;
    } catch (err) {
        throw new Error('An error occurred while generating the token!');
    }
}

async function userLogout(userToken) {
    tokenBlackList.add(userToken);
}

const getUserById = (userId) => User.findById(userId).select('-password'); 

module.exports = {
    userRegister,
    userLogin,
    userLogout,
    getUserById,
};