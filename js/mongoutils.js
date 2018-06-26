import config from 'config';

const MongoClient = require('mongodb').MongoClient;
const mongoHost = config.get('mongodb.host');
const mongoPort = config.get('mongodb.port');
const mongoUrl = config.util.getEnv('MONGO_URL') || 'mongodb://' + mongoHost + ':' + mongoPort;

let client;

module.exports = {
    initMongoConnection : async () => {
        let client = await MongoClient.connect(mongoUrl);
        console.log("Database connection established");
        return client;
    },
    closeMongoConnection : (client) => {
        if(client) {
            client.close();
            console.log("Connection to database closed");
        }
    }
};