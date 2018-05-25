import "babel-polyfill";
import Hapi from 'hapi';
import routes from './routes';
import anxpro from './anxpro';

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
            logEvents: ['response']
         }
      },
      anxpro
   ]);

   await server.start();
   console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
   console.log(err);
   process.exit(1);
});

init();
