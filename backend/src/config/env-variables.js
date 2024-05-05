const dotenv = require('dotenv');
dotenv.config();


module.exports = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    TRANSACTION_API_END_POINT: process.env.TRANSACTION_API_END_POINT,
    HOST: process.env.HOST,
}