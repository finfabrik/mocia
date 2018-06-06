import "babel-polyfill";
import './mockws';
import Hapi from 'hapi';
import routes from './routes';
import anxpro from './anxpro';
import bitfinex from './bitfinex';

const server = Hapi.server({
   port: 3000,
   host: 'localhost'
});

server.route(routes);

const init = async () => {
   await server.register([
      {
         plugin: require('hapi-pino'),
         options: {
            prettyPrint: true,
            logEvents: false
         }
      },
      bitfinex
   ]);

   await server.start();
   console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
   console.log(err);
   process.exit(1);
});

init();
