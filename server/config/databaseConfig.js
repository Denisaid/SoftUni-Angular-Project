const mongoose = require('mongoose');

module.exports = async (connectionString) => {
    try {
        await mongoose.connect(connectionString);

        console.log('Database is successfully connected!');
    } catch (error) {
        console.error(error.message);
        console.log('Error to initialize Database');
        process.exit(1);
    }
}