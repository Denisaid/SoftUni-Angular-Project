const express = require('express');
const dotenv = require('dotenv');
const databaseConfig = require('./config/databaseConfig');
const expresConfig = require('./config/expresConfig');

dotenv.config();

(async function start() {
    const app = express();

    const connectionString = process.env.CONNECTION_STRING;
    await databaseConfig(connectionString);
    expresConfig(app);

    const port = process.env.PORT;
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
})();