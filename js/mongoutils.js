import config from 'config';
import Mongoose from 'mongoose';

const mongoHost = config.get('mongodb.host');
const mongoPort = config.get('mongodb.port');
const mongoUrl = process.env.MONGO_URL || 'mongodb://' + mongoHost + ':' + mongoPort;

const dbname = 'response_test';

const options = {
    auth: { authSource: "admin" },
    user: config.get('mongodb.username'),
    pass: config.get('mongodb.pwd')
};

module.exports = {
    initMongoConnection : async () => {
        Mongoose.connect(mongoUrl + '/response_test', options);
        Mongoose.connection.once('open', () => {
            console.log('Connected to mongodb');
        }).on('error', () => new Error('failed to connect mongodb'));
     
    },
    closeMongoConnection : () => {
        Mongoose.disconnect(() => {
            console.log("Disconnected from database")
        }).on('error', () => new Error('failed to disconnect properly'));
    }
};