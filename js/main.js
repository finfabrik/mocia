import "babel-polyfill";
import './mockws';
import Hapi from 'hapi';
import routes from './routes';
import anxpro from './anxpro';
import bitfinex from './bitfinex';

//=====> Mongo Client Addons - to be put into seperate module
var MongoClient = require('mongodb').MongoClient;
var config = require('../_config');
let mongoUrl = config.mongoURI['test'];
//<====== Mongo client addons - to be put into seperate module

let client;

const server = Hapi.server({
   port: 3000,
   host: 'localhost'
});

server.route(routes);

//========> Mongo Connection handlers
const initMongoConnection = async () => {
    client = await MongoClient.connect(mongoUrl);
    console.log("Database connection established");
}
const closeMongoConnection = () => {
    if(client) {
        client.close();
        console.log("Connection to database closed");
    }
}
//<======== Mongo Connection Handlers

const init = async () => {
    if(process.env.MONGO_URL) mongoUrl = process.env.MONGO_URL; 
    await initMongoConnection();
    await server.register([
        {
            plugin: require('hapi-pino'),
            options: {
            prettyPrint: true,
            logEvents: false
            }
        },
        {
            plugin: bitfinex,
            options: {
                dbClient: client
            }
        }
    ]);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
   console.log(err);
   closeMongoConnection();
   process.exit(1);
});

init();
