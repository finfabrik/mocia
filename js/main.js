import "babel-polyfill";
import './mockws';
import Hapi from 'hapi';
import routes from './routes';
import anxpro from './anxpro';
import bitfinex from './bitfinex';
import config from 'config';

//=====> Mongo Client Addons - to be put into seperate module
const MongoClient = require('mongodb').MongoClient;
const mongoHost = config.get('mongodb.host');
const mongoPort = config.get('mongodb.port');
const mongoUrl = config.util.getEnv('MONGO_URL') || 'mongodb://' + mongoHost + ':' + mongoPort;

//<====== Mongo client addons - to be put into seperate module
const hapiPort = config.get('server.api');
const server = Hapi.server({
   port: hapiPort,
   host: 'localhost'
});

server.route(routes);

//========> Mongo Connection handlers
let client;
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
