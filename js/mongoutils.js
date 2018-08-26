import config from 'config';
import Mongoose, { Schema } from 'mongoose';

const mongoHost = config.get('mongodb.host');
const mongoPort = config.get('mongodb.port');
const mongoUrl = process.env.MONGO_URL || 'mongodb://' + mongoHost + ':' + mongoPort;

const dbname = 'response_test';

const options = {
    auth: { authSource: "admin" },
    user: config.get('mongodb.username'),
    pass: config.get('mongodb.pwd')
};

let quoinexScheme = new Schema({
    id : String,
    order_type: String,
    side: String,
    status: String
}, { versionKey: false }, { _id : false });
quoinexScheme.methods.cancel = function() {
    this.status = "cancelled";
};
let quoinexOrder = Mongoose.model('quoinexOrders', quoinexScheme);

module.exports = {
    initMongoConnection : async () => {
        Mongoose.connect(mongoUrl + '/MockServer', options);
        Mongoose.connection.once('open', () => {
            console.log('Connected to mongodb');
        }).on('error', () => new Error('failed to connect mongodb'));
     
    },
    closeMongoConnection : () => {
        Mongoose.disconnect(() => {
            console.log("Disconnected from database")
        }).on('error', () => new Error('failed to disconnect properly'));
    },
    quoinexOrder : quoinexOrder
};