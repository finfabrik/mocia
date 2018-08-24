import "babel-polyfill";
import './mockws';
import Hapi from 'hapi';
import routes from './routes';
import anxpro from './anxpro';
import bitfinex from './bitfinex';
import quoinex from './quoinex';
import config from 'config';
import MongoUtils from './mongoutils';


const hapiPort = config.get('server.api');
const server = Hapi.server({port: hapiPort});

server.events.on('request', (request, event, tags) => {
    if(tags['error']){
        console.error("Possible incorrect path : " + request.path );
        console.error('Req type : ' + request.method);   
    }
});

const init = async () => {
    await MongoUtils.initMongoConnection();
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
            }
        },
        {
            plugin: quoinex,
            options: {
            }
        }
    ]);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
   console.log(err);
   MongoUtils.closeMongoConnection();
   process.exit(1);
});

init();
