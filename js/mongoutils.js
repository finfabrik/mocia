import config from 'config';
import Mongoose, { Schema } from 'mongoose';

const mongoHost = config.get('mongodb.host');
const mongoPort = config.get('mongodb.port');
const mongoDatabase = 'MockServer';
const mongoUrl = process.env.MONGO_URL || 'mongodb://' + mongoHost + ':' + mongoPort;

const options = {
    auth: { authSource: "admin" },
    user: config.get('mongodb.username'),
    pass: config.get('mongodb.pwd')
};

let quoinexScheme = new Schema({
    id : String,
    order_type: String,
    side: String,
    status: String,
    updated: Boolean,
    quantity: String,
    filled_quantity: String
}, { versionKey: false }, { _id : false });
quoinexScheme.methods.getQuantity = function() {
    return this.quantity;
};
let quoinexOrder = Mongoose.model('quoinexOrders', quoinexScheme);

let bitfinexScheme = new Schema({
    id : String,
    is_live: Boolean,
    is_cancelled: Boolean,
    original_amount: String,
    remaining_amount: String,
    executed_amount: String,
    side: String,
    type: String,
    symbol: String,
    timestamp: String
}, { versionKey: false }, { _id : false });
bitfinexScheme.methods.getOriginalAmount = function(){
    return this.original_amount;
};
let bitfinexOrder = Mongoose.model('bitfinexOrders', bitfinexScheme);

module.exports = {
    initMongoConnection : async () => {
        Mongoose.connect(mongoUrl + '/' + mongoDatabase, options);
        Mongoose.connection.once('open', () => {
            console.log('Connected to mongodb');
        }).on('error', () => new Error('failed to connect mongodb'));
     
    },
    closeMongoConnection : () => {
        Mongoose.disconnect(() => {
            console.log("Disconnected from database")
        }).on('error', () => new Error('failed to disconnect properly'));
    },
    quoinexOrder : quoinexOrder,
    bitfinexOrder : bitfinexOrder
};